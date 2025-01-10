import { Schema, Document } from 'mongoose';
import { Message } from './message-model';
import { User } from 'src/user/user-model';

export enum ChatType{
    CHAT = 'CHAT',
    GROUP_CHAT = 'GROUP_CHAT',
}

export interface Chat  extends Document{
    chat_type: string;
    messages: Message[];
    participants:User[];
    createdAt?:Date;
    updatedAt?: Date;
}

export const ChatSchema = new Schema({
    chat_type: {
        type: String,
        enum: Object.values(ChatType), 
        required: true,
        default: ChatType.CHAT,
    },
    messages:[
        {
            type:Schema.Types.ObjectId,
            ref: 'Message',
        }
    ],
    participants:[
        {
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true,
        }
    ],
},{timestamps:true})