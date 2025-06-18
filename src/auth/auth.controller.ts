import { Body, Controller, Post, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { connexionUserDto } from './connexion-user.dto';
import { authServiceRevision } from './auth.service.revision';
import { AppService } from 'src/app.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService,
                private authServiceRevision: authServiceRevision,
                private appService:AppService
    ){}


    @Post('inscription')
    CreateUser(@Body() userData:CreateUserDto,@Res() res:Response){
        return this.authService.createUser(userData.fullname,userData.pseudo,userData.email,userData.password,res);
    }

    @Post('connexion')
    loginUser(@Body() userData:connexionUserDto,@Res() res:Response){
        return this.authService.connexionUser(userData.email,userData.password,res);
    }

    @Post('otp/verify')
    otpVerify(@Body() dataUser:string, @Res() res:Response) {
        console.log("email:",dataUser["email"]);
        return this.authService.verifyOTP(dataUser["codeOTP"],dataUser["email"],res);
    }

   // @Post('envoi-email')
   // sendEmail(@Body() to:string,codeOTP:string, @Res){ }

   
    @Post('otp/generate')
    generateOTP(@Body() name:string) {
        const otp = this.authServiceRevision.genereOpt(8);
        console.log("otp:",otp);
        return {
            otp: otp,
            message: `L'OTP a été généré pour ${name}`
        };
    }

    
}
