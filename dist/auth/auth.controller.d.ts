import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { connexionUserDto } from './connexion-user.dto';
import { authServiceRevision } from './auth.service.revision';
import { AppService } from 'src/app.service';
export declare class AuthController {
    private authService;
    private authServiceRevision;
    private appService;
    constructor(authService: AuthService, authServiceRevision: authServiceRevision, appService: AppService);
    CreateUser(userData: CreateUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    loginUser(userData: connexionUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    otpVerify(dataUser: string, res: Response): Promise<Response<any, Record<string, any>>>;
    generateOTP(name: string): {
        otp: string;
        message: string;
    };
}
