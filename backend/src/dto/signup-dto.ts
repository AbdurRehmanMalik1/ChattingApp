import { Type } from "class-transformer";
import { IsDate, IsNotEmpty,IsString } from "class-validator";


export class SignUpDto{
    @IsNotEmpty({ message: 'Name cannot be empty' })
    @IsString({ message: 'Name must be a string' })
    name: string; 
    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsString({ message: 'Email must be a string' })
    email: string; 
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString({ message: 'Password must be a string' })
    password: string; 
    @Type(() => Date)
    @IsDate({ message: 'Date of Birth must be a valid date' })
    DoB: Date; 
    @IsNotEmpty({ message: 'Phone Number cannot be empty' })
    @IsString({ message: 'Phone Number must be a string' })
    phoneNumber: string 
}