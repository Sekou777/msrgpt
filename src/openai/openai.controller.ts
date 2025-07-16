import { error } from 'console';
import { DataPromptDto } from './data-prompt.dto';
import { OpenaiService } from './openai.service';
import { Body, Controller, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

type OptionType = 'scan' | 'footprint' | 'enum';

enum OptionEnum {
    SCAN = 'scan',
    FOOTPRINT = 'footprint',
    ENUM = 'enum'
}

 

@Controller('openai')
export class OpenaiController {



    constructor(private readonly openaiService:OpenaiService ) {}

    @UseGuards(JwtAuthGuard)
    @Post('/chat')
    async sendPrompt(@Body() dataPrompt:DataPromptDto, @Res() res:Response,@Request() req) {
        try {

            // verifier que le mail est confirmée
            this.openaiService.confirmEmail(req.user.userId, res, req);
            // recuperer id a partie du token
            console.log(req.user);
            //verification de option envoyée est scan,footprint ou ennum
            if (OptionEnum.SCAN != dataPrompt.option && OptionEnum.FOOTPRINT != dataPrompt.option && OptionEnum.ENUM != dataPrompt.option) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    error: true,
                    message: "Option invalide. Les options valides sont 'scan', 'footPrint' ou 'enum'."
                });

            }

            let DataPromptOption;
            if(dataPrompt.option == OptionEnum.SCAN) {
                DataPromptOption = "Faire un scanning";
            } else if(dataPrompt.option == OptionEnum.FOOTPRINT) {
                DataPromptOption = "Faire un footprint";
            }
            else if(dataPrompt.option == OptionEnum.ENUM) {
                DataPromptOption = "Faire une enumération";
            }
 
           const fullPrompt = `Option sélectionnée : ${DataPromptOption}. Action : ${dataPrompt.prompt}.\nRetourne uniquement la commande à exécuter sans aucun commentaire ni explication.`;
            return  this.openaiService.sendPrompt(fullPrompt, req.user.userId, res);
             
        } catch (error) {
            console.error("Erreur lors de l'envoi du pompt:", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Echec d'envoi du prompt"});
        }
        
    }



}
