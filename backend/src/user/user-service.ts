import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user-model";

@Injectable()
export class UserService{
    constructor(@InjectModel('User') private userModel : Model<User>){}

    async createUser(name:string , email:string):Promise<User>{
        const user =  new this.userModel({name,email});
        return user.save();
    }
    async findAll() : Promise<User[]> {
        return this.userModel.find().exec();
    }
}