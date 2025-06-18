import { IsEmail, IsEmpty, IsMobilePhone, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    fullname: string;

    @IsString()
    @IsNotEmpty()
    pseudo: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    //@IsMobilePhone()
    //telNumber?: string;
}