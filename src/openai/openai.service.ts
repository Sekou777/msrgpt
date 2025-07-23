import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {OpenAI} from "openai";
import { Prompt } from 'src/prompt/prompt.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Prompt_usage } from 'src/prompt/prompt_usage.entity';

@Injectable()
export class OpenaiService {
   private openai: OpenAI
   private promptNumber: number 

    constructor(
        @InjectRepository(Prompt)
        private readonly promptRespository: Repository<Prompt>,
        @InjectRepository(User)
        private readonly userRespository: Repository<User>,
        @InjectRepository(Prompt_usage)
        private readonly usageRespository: Repository<Prompt_usage>,
    )
        
   {

        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        this.promptNumber = 0; // initialisation du compteur de prompt

    }
    
    promptCount(): number {
            return this.promptNumber + 1;
    }



    async sendPrompt(prompt: string, userId: string) {

         try {

            // verification de l'existance de l'utilisateur

            const verifyUser = await this.userRespository.findOne({
                where: {id: userId},
            });

            if(!verifyUser){
                throw new Error("Utilisateur non trouvé");
            }

        // verificatio de l'existance de l'utilisateur dans la table  promptUsage
        let usage = await this.usageRespository.findOne({
            where: { 
                user: { id: userId },
                date: new Date().toISOString().split('T')[0] // verifie si l'entrée est pour aujourd'hui
            },
            relations: ['user'] // Assurez-vous que la relation avec l'utilisateur(user) est chargée 
        });

        //si l'utilsateur atteint le nombre de prompt maximum renvoyer un message d'erreur
          if(usage && usage.comptage_prompt >= 5){
            throw new Error("Vous avez atteint la limite des 5 prompts par jour.");
          }
       

         const completion = await this.openai.chat.completions.create({
            model: "gpt-4.1",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

       if (!completion.choices?.[0]?.message?.content) {
            throw new Error("Réponse OpenAI invalide");
        }
           const aiReponse = completion.choices[0].message.content;

            const newPrompt = await this.promptRespository.create({
                message: prompt,
                reponse: aiReponse,
          });
             await this.promptRespository.save(newPrompt);

             if(usage){
                // si l'utilisateur existe déjà dans la table promptUsage, on incrémente le compteur
                usage.comptage_prompt += 1;
             }
                else{
                // sinon on crée une nouvelle entrée pour l'utilisateur dans la table promptUsage
                usage = this.usageRespository.create({
                    user: verifyUser,
                    comptage_prompt: 1,
                    date: new Date().toISOString().split('T')[0] // utiliser la date du jour
                    
                });
             }
                await this.usageRespository.save(usage);

                return {
                    error: false,
                    message: " Prompt enregistré avec succès",
                    prompt: prompt,
                    data: aiReponse,
                    limite: `Vous avez utilisé ${usage.comptage_prompt} prompts aujourd'hui. Il vous reste ${5 - usage.comptage_prompt} prompts pour aujourd'hui.`,
                };
             } 
      catch (error) {
            console.log("Error:", error)
            throw error;
     }}

       
    }
    
