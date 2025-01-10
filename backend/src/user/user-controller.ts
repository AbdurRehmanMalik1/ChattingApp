import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user-service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() userDetails: { name: string, email: string }) {
    return this.userService.createUser(userDetails.name,userDetails.email);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
