import { IsNotEmpty, IsString } from "class-validator";

export class DataPromptDto {

    @IsString()
    @IsNotEmpty()
    option: string;

    @IsString()
    @IsNotEmpty()
    prompt:string;

}