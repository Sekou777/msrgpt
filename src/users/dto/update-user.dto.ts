import { IsEmail, IsMobilePhone, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";


export class UpdateUserDto {

    fullname?: string;
    pseudo?: string;
    email?: string;
    telNumber?: string;

    @IsString()
    @IsNotEmpty()
    idUsers: string;
}