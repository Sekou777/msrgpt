import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from "express";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getAllUser(): Promise<{
        error: boolean;
        message: string;
        data: import("./user.entity").User[];
        nbUsers: number;
    }>;
    updateProfile(userData: UpdateUserDto): Promise<{
        error: boolean;
        message: string;
        data: import("./user.entity").User;
    }>;
    deleteProfile(idUsers: string): Promise<{
        error: boolean;
        message: string;
    }>;
    getUserInfo(userId: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
