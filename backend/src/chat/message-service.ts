import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/user-model";
import { Chat } from "./chat-model";
import { Message } from "./message-model";

@Injectable()
export class MessageService{
    constructor(
        @InjectModel('User') private userModel : Model<User>,
        @InjectModel('Message')  private messageModel : Model<Message>
    ){}

    async createMessage(
        message_type: string,
        content: string,
        sender_id: string,
        receiver_id: string
    ): Promise<Message> {
        try {
            const senderUser: User = await this.userModel.findById(sender_id);
            if (!senderUser) throw new BadRequestException("Invalid Sender");
            
            const receiverUser: User = await this.userModel.findById(receiver_id);
            if (!receiverUser) throw new BadRequestException("Invalid Reciever");
            
            const message: Message = new this.messageModel({
                message_type,
                content,
                sender_id,
                receiver_id,
            });
            
            return await message.save();
        } catch (error) {
            throw new BadRequestException(error.message || "An error occurred while creating the message");
        }
    }
    
    
}