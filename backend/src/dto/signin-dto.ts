import { IsNotEmpty, IsString } from "class-validator";


export class SignInDto{
    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsString({ message: 'Email must be a string' })
    email: string; 
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString({ message: 'Password must be a string' })
    password: string; 
}