import { Schema, Document } from 'mongoose';

export interface Message  extends Document{
    message_type: string;
    content:string;
    sender_id:string;
    receiver_id:string;
    createdAt?: Date;
    updatedAt?:Date;
}

export const MessageSchema = new Schema({
    message_type:{
        type:String,
        required:true,
        default: 'text',
    },
    content:{
        type:String,
        required:true,
    },
    sender_id: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    receiver_id: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
} , {timestamps:true})