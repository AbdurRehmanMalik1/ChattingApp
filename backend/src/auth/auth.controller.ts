import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user-model';
import { JwtService } from '@nestjs/jwt';

function isNullOrEmpty(value: string | null | undefined): boolean {
    return !value || value.trim().length === 0;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService) {}



    @HttpCode(HttpStatus.OK)
    @Post('/login') async signIn(
        @Body() signInCredentials: { 
        email: string; 
        password: string; })
    {
        const {email,password} = signInCredentials;
        if (isNullOrEmpty(email) || isNullOrEmpty(password) ) 
        throw new BadRequestException('Missing Sign In Fields');

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
  async signUp(
    @Body() userDetails: { 
      name: string; 
      email: string; 
      password: string; 
      DoB: Date; 
      phoneNumber: string 
    }
  ) {
    const { name, email, password, DoB, phoneNumber } = userDetails;

    // Validate required fields
    if (
      isNullOrEmpty(name) || 
      isNullOrEmpty(email) || 
      isNullOrEmpty(password) || 
      isNullOrEmpty(phoneNumber) || 
      !DoB
    ) {
      throw new BadRequestException(
        'Missing required fields: name, email, password, DoB, or phoneNumber'
      );
    }

    // Prepare user object
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