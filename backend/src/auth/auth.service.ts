import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/user-model';
import { UserService } from 'src/user/user-service';

import * as bcrypt from 'bcrypt';

const saltRounds : number=parseInt(process.env.SALT_LENGTH);
const jwtSecret : string = process.env.JWT_SECRET;

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService
    ) {}

    async signIn(email: string, pass: string): Promise<any> {
        const user :  User = await this.usersService.findOneByEmail(email);
        if (!user) 
            throw new UnauthorizedException('Invalid credentials');
        
        const hashedPassword : string = user.password;
        const isMatch = await bcrypt.compare(pass, hashedPassword);
        if (!isMatch) 
            throw new UnauthorizedException('Invalid credentials');
        return user;
    }
    async signUp(user: any): Promise<User> {
        const { name, email, password, phoneNumber, DoB } = user;
        
        const emailExists = await this.usersService.findOneByEmail(email);
        if(emailExists)
            throw new ConflictException("Email already in use");
        const phoneNumberExists = await this.usersService.findOneByPhoneNumber(phoneNumber);
        if(phoneNumberExists)
            throw new ConflictException("Phone Number already in use");


        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const createdUser = await this.usersService.createUser({
          name,
          email,
          password: hashedPassword,
          phoneNumber,
          DoB,
        });
        return createdUser;
    }
    createJwtToken():any{

    }
}
