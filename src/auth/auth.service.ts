import { HttpCode,HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Response } from "express";
import { error } from 'console';
import { JwtService } from '@nestjs/jwt';
import { AppService } from 'src/app.service';
import OpenAI from 'openai';
 
@Injectable()
export class AuthService {
   
    constructor(@InjectRepository(User) 
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
        private readonly appService: AppService,
        
    ){}

    genereOTp(length: number = 6): string  {
        let Codeotp = "";
        for (let i=0; i<length; i++){
            Codeotp += Math.floor(Math.random() * 10);

        }
        return Codeotp;
    }

    async verifyOTP(codeOTP:string, email:string, res :Response) {

        if (!email.endsWith('@gmail.com')) {
            console.log(email);
            return res.status(HttpStatus.BAD_REQUEST).json({
                error: true,
                message: "Uniquement des email de gmail"
            })
        }

        try {
            const userVerify = await this.userRepository.findOne({where : {email}});

        if(!userVerify){
            return res.status(HttpStatus.BAD_REQUEST).json({
                error: true,
                message: "Mail fourni invalide !"
            })
        }

        if (userVerify.codeOTP !== codeOTP) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                error: true,
                message: "le code otp invalide !"
            })
        }              

        const updateData = this.userRepository.update(userVerify.id,{ 
            emailVerify:true,
            codeOTP:""
        })

        if (!updateData) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error:true,
                message:" Une erreur est survenue !"
            })
        }

        return res.status(HttpStatus.OK).json({
            error:false,
            message: "Verification effectuée avec succes."
        })

            
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: `Erreur survenue:  ${error.message}`
            })  
        }
    }    
       async createUser(fullname:string ,pseudo:string,email:string,password:string, res: Response) {   
        if (!email.endsWith('@gmail.com')) {
            console.log(email);
            return res.status(HttpStatus.BAD_REQUEST).json({
                error: true,
                message: "Uniquement des email de gmail"
            })
        }
    
        try {
            
            const verifyEmail = await this.userRepository.findOne({ where:{
                email: email
            }})
    
            console.log("user verify: ", verifyEmail)
    
             if (verifyEmail) {
                return res.status(HttpStatus.CONFLICT).json({
                    error: true,
                    message: "Email existe déjà"
                })
            }
    
            const verifyUser = await this.userRepository.findOne({ where:{
                fullname: fullname
            }})
    
            console.log("user verify: ", verifyUser)
    
            if (verifyUser) {
                return res.status(HttpStatus.CONFLICT).json({
                    error: true,
                    message: "User existe déjà"
                })
            }

            const verifyPseudo = await this.userRepository.findOne({ where:{
                pseudo: pseudo
            }})
    
            console.log("pseudo verify: ", verifyPseudo)
    
            if (verifyPseudo) {
                return res.status(HttpStatus.CONFLICT).json({
                    error: true,
                    message: "Pseudo existe déjà"
                })
            }
            
            const saltOrRounds = 10;
            
            console.log('send password: ', password)
            const passwordUser = password;
            const hash = await bcrypt.hash(passwordUser, saltOrRounds);
            password = hash;

            const codeOTP = this.genereOTp();

            const saveData = this.userRepository.create({fullname,pseudo,email,password,codeOTP})
            const saveUser= await this.userRepository.save(saveData);

            if(!saveUser){
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    error:true,
                    message:'Enregistrement non effectué !'
                })
            }

            // Envoi de l'email de confirmation
           await this.appService.sendEmail(email,codeOTP);
    

            return res.status(HttpStatus.CREATED).json({
                error:false,
                message:'Enregistrement effectué.',
                data:saveData
            })
    
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: `Erreur survenue:  ${error.message}`
            })
        }
            
    }



    async connexionUser(email:string,password:string,res:Response) {

        if (!email.endsWith('@gmail.com')) {
            console.log(email);
            return res.status(HttpStatus.BAD_REQUEST).json({
                error: true,
                message: "Uniquement des email "
            })
        }


        try {

            const verifyMail = await this.userRepository.findOne({ where:{
                email: email
            }})


            if (!verifyMail) {
                return res.status(HttpStatus.CONFLICT).json({
                    error: false,
                    message: "Email inexitant !"
                })
            }


        const isMatch = await bcrypt.compare(password, verifyMail.password);

        if(!isMatch){
            return res.status(HttpStatus.BAD_REQUEST).json({
                error:false,
                message:"Connexion echoué ! réessayer "
            })
        }

        const payload = { sub: verifyMail.id, username: verifyMail.pseudo };
        const token= await this.jwtService.signAsync(payload);

        return res.status(HttpStatus.OK).json({
            error:false,
            message:'Conneion réussi',
            token:token
        })
            
        } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: true,
                message: `Erreur survenue:  ${error.message}`
            }) 
        }
    }  
}
