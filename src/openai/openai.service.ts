import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import OpenAI from 'openai';
import { Prompt } from 'src/prompt/prompt.entity';
import { Prompt_usage } from 'src/prompt/prompt_usage.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OpenaiService {
    private openai: OpenAI;
    private  promptNumber: number;

    constructor(
        @InjectRepository(Prompt)
        private readonly promptRepository: Repository<Prompt>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Prompt_usage)
        private readonly usageRepository: Repository<Prompt_usage>,
         
    ) {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.promptNumber = 0; // Initialisation du compteur de prompts
    }

    // Méthode pour obtenir le nombre de prompts envoyés
    promptCompt(): number {
        return this.promptNumber + 1;
    }  
    
    async confirmEmail(userId: string, res: Response, req: any) {
        
        try {
            
              const userVerify = await this.userRepository.findOne({
            where: {id: req.user.userId},
        });
        // Vérification de l'existence de l'utilisateur
        

        if(!userVerify){
            return res.status(HttpStatus.FORBIDDEN).json({
                error: true,
                message: "Utilisateur non trouvé"
            });
        }
        // verification que le champs emailVerify est à true
        if(userVerify.emailVerify !== true){
            return res.status(HttpStatus.FORBIDDEN).json({
                error: true,
                message: "Verifier votre boite mail pour la confirmation de votre email fourni à l'inscription avant de continuer"
            });
        }

        } catch (error) {
            console.log("Error:", error)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: `Erreur survenu: ${error.message}`
            })
            
        }
     }

    async sendPrompt(prompt: string,userId: string,res:Response) {
        try {
            
           //verification l'existence de l'utilisateur
           const verifyUser= await this.userRepository.findOne({
            where: { id: userId },
           });
           if(!verifyUser) {
            return res.status(HttpStatus.FORBIDDEN).json({
                error: true,
                message: "Utilisateur non trouvé"
            });
           }
            // verification de utilisateur dans la table promptUsage
           let usage = await this.usageRepository.findOne({
            where: {
                user:{id: userId},
                date: new Date().toISOString().split('T')[0] // Vérifie si l'entrée est pour aujourd'hui
            },
            relations: ['user'] // Assurez-vous de charger la relation user
           })
           // Si l'utilisateur atteint la limite de prompts, renvoyer une erreur
           if(usage && usage.comptage_prompt >= 5) {
            return res.status(HttpStatus.FORBIDDEN).json({
                error: true,
                message: "Vous avez atteint la limite de 5 prompts par jour."
            });
           }
        

            const response = await this.openai.chat.completions.create({
                model: 'gpt-4.1', 
                messages: [{ role: 'user', content: prompt }],
            });

            if (!response.choices?.[0]?.message?.content) {
               return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message:'Réponse OpenAI invalide'
                });
            }

            const aiResponse = response.choices[0].message.content;

            const newPrompt = this.promptRepository.create({
                message: prompt,
                reponse: aiResponse
            });

            await this.promptRepository.save(newPrompt);

            if(usage){
                usage.comptage_prompt += 1;
            }else {
                usage = this.usageRepository.create({
                    user: verifyUser,
                    date: new Date().toISOString().split('T')[0], // Utiliser la date actuelle
                    comptage_prompt: 1,
                });
            }
            await this.usageRepository.save(usage);
            
            return {
                            error: false,
                            message: "réquete exécutée avec succès",
                            prompt: prompt,
                            data: aiResponse,
                            limite: `Vous avez utilisé ${usage.comptage_prompt} prompts aujourd'hui. Il vous reste ${5 - usage.comptage_prompt} prompts pour aujourd'hui.`,          
                    };
             
            
        } catch (error) {
            console.error('Erreur:', error);
           return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message:`Erreur: ${error.message}`
                });
        }}
    }