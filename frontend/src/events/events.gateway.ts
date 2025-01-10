import { Injectable } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { Chat } from 'src/chat/chat-model';
import { ChatService } from 'src/chat/chat-service';
import { Message } from 'src/chat/message-model';
import { MessageService } from 'src/chat/message-service';


@WebSocketGateway({
    cors: {
      origin: '*',
    },
})
@Injectable()
export class EventsGateway {
    @WebSocketServer()
    server: Server; 
    constructor(
        readonly chatService:ChatService,
        readonly messageService:MessageService,
    ){}
    //user socket and socket_id
    private connectedUsers: Map<String, Socket> = new Map();
    //Chat Room Id , Key Value of Pair of User ID with their socket id
    private chatRooms : Map<string, Map<string,string>> = new Map(); 

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
        this.connectedUsers.set(client.id, client); // Add the socket to the list
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        // Iterate through chatRooms to find the chat the client belongs to
        this.chatRooms.forEach((userIdSocketMap: Map<string, string>, chatId: string) => {
            // If the client is part of the current chat room
            if (userIdSocketMap.has(client.id)) {
                console.log(`Client ${client.id} is part of chat room ${chatId}. Removing...`);
                userIdSocketMap.delete(client.id);  // Remove the client from the room
            }
        });
        // Remove from the connected users map
        this.connectedUsers.delete(client.id);  // Remove the socket from the list
        console.log(`Client ${client.id} removed from connected users list.`);
    }
    @SubscribeMessage('sendAdditionalInfo')
    async handleRetrieveInfo(@ConnectedSocket() client : Socket , @MessageBody() data: { sender_id: string,chat_id:string }): Promise<any> {
        // console.log('Retrieve additional info for user:');
        // console.log(data);
        const {sender_id , chat_id} = data;
        if (!sender_id || !chat_id) {
            console.error('Invalid data received:', data);
            return { error: 'Invalid data' };
        }        
        if(!this.chatRooms.get(chat_id)){
            const userIdSocketMap : Map<string, string> = new Map();//socketids with users
            userIdSocketMap.set(
                client.id,
                sender_id,
            );
            this.chatRooms.set(chat_id , userIdSocketMap);
        }else{
            const userIdSocketMap : Map<string, string> =  this.chatRooms.get(chat_id);
            userIdSocketMap.set(
                client.id,
                sender_id,
            );
        }
    }

    @SubscribeMessage('events')
    async handleEvent(@MessageBody() eventBody: { message: Message , chat_id:string}): Promise<any> {
        console.log(eventBody);
        await this.chatService.arePartOfChat(
            eventBody.chat_id,
            eventBody.message.sender_id,
            eventBody.message.receiver_id
        );
        return eventBody;
    }
    @SubscribeMessage('send-message')
    async handleSendMessage(@ConnectedSocket() client : Socket , @MessageBody() messagePayLoad: { message: Message , chat_id:string}): Promise<any> {
        console.log(messagePayLoad);
        const {content, sender_id , receiver_id, message_type} = messagePayLoad.message;
        const chat_id : string = messagePayLoad.chat_id;
        await this.chatService.arePartOfChat(
            chat_id,
            sender_id,
            receiver_id
        );
        const createdMessage  : Message = await this.messageService.createMessage(
            message_type || 'text',
            content,
            sender_id,
            receiver_id
        );
        const updatedChat : Chat= await this.chatService.sendMessage(chat_id , createdMessage);
        //console.log("Updated Chat")
        // console.log(updatedChat);

        const userIdSocketMap = this.chatRooms.get(chat_id); // Assuming this is a Map of chat rooms and user socket mappings

        if (userIdSocketMap) {
            for (const [socketId, userId] of userIdSocketMap) {
                if (socketId !== client.id) {
                    const recipientSocket = this.connectedUsers.get(socketId);
                    if (recipientSocket) {
                        // Emit the message to the recipient's socket
                        recipientSocket.emit('newMessage', {
                            message: createdMessage,
                            chat_id: chat_id,
                            sender_id: sender_id,
                        });
                    }
                }
            }
        }

        
        console.log("Yes users are part of chat now implement the send message");
        

        return createdMessage;
    }
}
