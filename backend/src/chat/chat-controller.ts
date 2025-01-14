import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Request, UseGuards } from "@nestjs/common";
import { UserService } from "src/user/user-service";
import { ChatService } from "./chat-service";
import { MessageService } from "./message-service";
import { Message } from "./message-model";
import { User } from "src/user/user-model";
import { Chat, ChatType } from "./chat-model";
import { Types } from "mongoose";
import { AuthGuard } from "src/auth/auth-guard";



@Controller("/chat")
export class ChatController{
    constructor(
        private readonly userService:UserService,
        private readonly chatService :ChatService,
        private readonly messageService:MessageService,
    ) {}

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('/my')
    public getMyChats(@Request() req){
        const userId : String= req.user?.sub;
        return this.chatService.getMyChats(userId);
    }

    @Post("/send-message")
    async sendMessage(@Body() message:{
        chat_id : string,
        message_type?:string,//can be null for default
        content:string,
        sender_id : string,
        receiver_id : string,
    }){
        if(!message.chat_id || message.chat_id.trim()==="")
            throw new BadRequestException("Chat Id Cannot be empty");
        if(!message.content || message.content.trim()==="")
            throw new BadRequestException("Message Content Cannot be empty");
        else if(!message.sender_id || message.sender_id.trim()==="")
            throw new BadRequestException("Sender Id Cannot be empty");
        else if(!message.receiver_id || message.receiver_id.trim()==="")
            throw new BadRequestException("Receiver Id Cannot be empty");
        if (!Types.ObjectId.isValid(message.sender_id)) {
            throw new BadRequestException("Invalid Sender ID");
        }
        if (!Types.ObjectId.isValid(message.receiver_id)) {
            throw new BadRequestException("Invalid Receiver ID");
        }
        await this.chatService.arePartOfChat(
            message.chat_id ,message.sender_id,message.receiver_id
        );

        const createdMessage : Message = await this.messageService.createMessage(
            message.message_type,message.content,
            message.sender_id,message.receiver_id
        );

        
        await this.chatService.sendMessage(message.chat_id, createdMessage)

        return {
            statusCode: HttpStatus.OK,
            message: "Message sent successfully",
            data: createdMessage,
        };
    }   
    @Post("/create")
    async createChat(@Body() chatDetails: { chat_type: ChatType; participants: User[] }) {
        // Check if chat_type is a valid enum value
        if(!chatDetails.chat_type)
            chatDetails.chat_type = ChatType.CHAT;
        if (!Object.values(ChatType).includes(chatDetails.chat_type)) {
            throw new BadRequestException("Invalid chat type");
        }
        if (!chatDetails.participants) {
            throw new BadRequestException('No Partipants In Chat');
        }
        await this.chatService.createChat(
            chatDetails.chat_type, chatDetails.participants
        );

    }
    
    @Get('/:chat_id')
    async getChat(@Param('chat_id') chat_id: string): Promise<Chat> {
      if (!chat_id || chat_id.trim() === '') {
        throw new BadRequestException('Chat Id Cannot be empty');
      }
  
      if (!Types.ObjectId.isValid(chat_id)) {
        throw new BadRequestException('Invalid Chat ID format');
      }
      return this.chatService.getChatById(chat_id);
    }
}