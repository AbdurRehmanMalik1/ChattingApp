import { Schema, Document } from 'mongoose';
import { timestamp } from 'rxjs';

export interface User extends Document {
  _id : string;
  name: string;
  email: string;
  password:string;
  imageUrl: string;
  phoneNumber:string;
  DoB: Date;
}

export const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true ,unique:true},
  password: {type:String, required:true,default:"1234"},
  imageUrl: {type:String,default:"/defaultImageUrl"},
  phoneNumber: { type: String, required: true ,unique:true},
  DoB: {type:Date,required:true}
},{timestamps:true});
