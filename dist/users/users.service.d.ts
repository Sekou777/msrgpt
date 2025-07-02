import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from "express";
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    createUser(userData: CreateUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllUser(): Promise<{
        error: boolean;
        message: string;
        data: User[];
        nbUsers: number;
    }>;
    updateProfile(userData: UpdateUserDto): Promise<{
        error: boolean;
        message: string;
        data: User;
    }>;
    deleteProfile(idUsers: string): Promise<{
        error: boolean;
        message: string;
    }>;
    UserInfo(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
