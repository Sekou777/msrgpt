import { Body, Controller, Post, Get, Put, Delete, Param, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from "express";

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService){}

    @Get('all')
    getAllUser() {
        return this.usersService.getAllUser();
    }

    @Put('update/profile')
    updateProfile(@Body() userData: UpdateUserDto){
        console.log(userData)
        return this.usersService.updateProfile(userData);
    }

    @Delete('delete/profile/:id')
    deleteProfile(@Param('id') idUsers: string) {
        return this.usersService.deleteProfile(idUsers);
    }

    @Get("UserInfo")
    getUserInfo(@Body() userId:string ,@Res() res: Response) {
        return this.usersService.UserInfo(userId,res);
    }

    
}
