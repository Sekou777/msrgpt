import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class connexionUserDto {

    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    password:string
}