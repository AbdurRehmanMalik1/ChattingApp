import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user-model";

@Injectable()
export class UserService{
   
    constructor(@InjectModel('User') private userModel : Model<User>){}

    async findAll() : Promise<User[]> {
        return this.userModel.find().exec();
    }
    async findOne(_id : string) : Promise<User>{
        return this.userModel.findById(_id);
    }
    async findOneByEmail(email : string) : Promise<User>{
        return this.userModel.findOne({email});
    }
    async findOneByPhoneNumber(phoneNumber: string): Promise<User> {
        return this.userModel.findOne({phoneNumber});
    }
    async createUser({
        name,email,password,phoneNumber,DoB,
      }: {
        name: string;email: string;password: string;phoneNumber: string;DoB: Date;
      }): Promise<User> 
    {
        const createdUser = await this.userModel.create({
          name,
          email,
          password,
          phoneNumber,
          DoB,
        });
        return createdUser;
    }
}
