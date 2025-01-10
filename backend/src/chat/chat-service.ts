import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/user-model";
import { Chat, ChatType } from "./chat-model";
import { Message } from "./message-model";

@Injectable()
export class ChatService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('Chat') private chatModel: Model<Chat>,
        @InjectModel('Message') private messageModel: Model<Message>
    ) {}
    
    async sendMessage(chat_id: string, createdMessage: Message): Promise<Chat> {
        // const chat = await this.chatModel.findById(chat_id);
        // if (!chat) {
        //     throw new BadRequestException("Invalid Chat Id");
        // }

        if (!createdMessage._id) {
            throw new BadRequestException("Message ID is missing");
        }

        return await this.chatModel.findByIdAndUpdate(
            { _id: chat_id },
            { $push: { messages: createdMessage._id } },
            { new: true } 
        );
    }
    
    async createChat(chat_type: ChatType, participants: User[]): Promise<Chat> {
        if (participants && participants.length < 2) {
            throw new BadRequestException('Cannot create a chat with less than 2 participants');
        }
    
        const participantIds = participants.map(user => user._id);
        const users = await this.userModel.find({ _id: { $in: participantIds } });
    
        if (users.length !== participantIds.length) {
            throw new BadRequestException('One or more participants are invalid');
        }
    
        const chat: Chat = new this.chatModel({
            chat_type,
            participants: participantIds, 
        });
    
        return chat.save();
    }

    async arePartOfChat(chat_id: string, sender_id: string, receiver_id: string) {
        const valid = await this.chatModel.findOne({
            _id: chat_id, 
            participants: { $all: [sender_id, receiver_id] }
        });
        if (!valid) {
            throw new BadRequestException("Participants are not part of the chat or invalid chat ID");
        }
    }
    async getChatById(chat_id:string) : Promise<Chat>{
       return this.chatModel.findById(chat_id);
    }
}
