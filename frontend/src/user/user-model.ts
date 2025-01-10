import { Schema, Document } from 'mongoose';
import { timestamp } from 'rxjs';

export interface User extends Document {
  _id : string;
  name: string;
  email: string;
}

export const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true ,unique:true},
  //profile pic
  //phoneNumber
  //dob
  //password
},{timestamps:true});
