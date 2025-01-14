import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user-model';
import { JwtService } from '@nestjs/jwt';
import { MessageBody } from '@nestjs/websockets';
import { SignInDto } from 'src/dto/signin-dto';
import { SignUpDto } from 'src/dto/signup-dto';

function isNullOrEmpty(value: string | null | undefined): boolean {
    return !value || value.trim().length === 0;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService) {}

    @HttpCode(HttpStatus.OK)
    @Post('/login') async signIn(@Body() signInDto: SignInDto){
        const {email,password} = signInDto;

        const user : User = await this.authService.signIn(email,password);

        const jwtPayload = {
            sub: user._id,
            name:user.name,
            email:user.email,
        }
        return {
            message:"Succesful Login",
            jwtToken: await this.jwtService.signAsync(jwtPayload),
        };
    }


  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signUp(@Body() userDetails: SignUpDto) {
    const { name, email, password, DoB, phoneNumber } = userDetails;
    
    const userObj :any = {
      name,
      email,
      password,
      phoneNumber,
      DoB,
    };
    const user : User = await this.authService.signUp(userObj);
    const jwtPayload = {
       sub: user._id,
       name:user.name,
       email:user.email,
    }
    return {
      message:"Succesful Signup",
      jwtToken: await this.jwtService.signAsync(jwtPayload),
    };
  }
}