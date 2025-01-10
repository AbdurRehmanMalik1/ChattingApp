import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  BadRequestException, 
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user-service';
import { User } from './user-model';
import { AuthGuard } from 'src/auth/auth-guard';



@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Request() req ){
    return req.user;
  }
 
}
