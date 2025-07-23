import { Body, Controller, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { DataPromptDto } from './data-prompt.dto';
import{ Response } from  'express'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

enum Option  {
        Scan = "Scan",
        Footprint = "Footprint",
        Enum = "Enum"
}

type Options = "Scan" | "Footprint" | "Enum";




@Controller('openai')
export class OpenaiController {

    constructor(private readonly openaiService: OpenaiService){}

      



    @UseGuards(JwtAuthGuard)
    @Post('/chat')
    async sendPrompt(@Body() dataprompt: DataPromptDto, @Res() res:Response, @Request() req){
         
      try {
          
        console.log(dataprompt)
        console.log(Option.Scan.toString())

        
        if(dataprompt.option != Option.Scan.toString() && dataprompt.option != Option.Footprint.toString()
            && dataprompt.option != Option.Enum.toString()){
                console.log('ereur de saisir')
                return res.status(HttpStatus.BAD_REQUEST).json({
                    error: true,
                    message: "erreur de saisie, veuillez entrer l'un de ses mots: Scan, Footprint ou Enum"
                })
             }

             let DataPromptOption;
        if(dataprompt.option == "Scan"){
            DataPromptOption = "faire un scanning "
        }

        else if(dataprompt.option == "Footprint"){
             DataPromptOption = "faire un footprinting"
        }

        else if(dataprompt.option == "Enum"){
            DataPromptOption = "faire une Enumeration"
        }
        

            const fullPrompt = `Option sélectionnée : ${DataPromptOption}. Action : ${dataprompt.prompt}.\nRetourne uniquement la commande à exécuter sans aucun commentaire ni explication.`;
            const response = await this.openaiService.sendPrompt(fullPrompt,req.user.userId);
            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            console.error("Erreur lors de l'envoi du pompt:", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
                error: "Echec d'envoi du prompt"});
        }
    }
      
}
