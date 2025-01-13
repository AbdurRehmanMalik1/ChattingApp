// import { ArgumentsHost, BadRequestException, Catch, HttpStatus, Injectable, UnauthorizedException, UseFilters, UseGuards } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { BaseWsExceptionFilter, ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io'
// import { jwtConstants } from 'src/auth/constants';
// import { WsJwtAuthGuard } from 'src/auth/ws-auth-guard';
// import { Chat } from 'src/chat/chat-model';
// import { ChatService } from 'src/chat/chat-service';
// import { Message } from 'src/chat/message-model';
// import { MessageService } from 'src/chat/message-service';


// @Catch(UnauthorizedException, BadRequestException)
// export class AllExceptionsFilter extends BaseWsExceptionFilter {
//   catch(exception: WsException, host: ArgumentsHost) {
//     const client = host.switchToWs().getClient();
    
//     if (exception instanceof UnauthorizedException) {
//       client.emit('unauthorized', { status:HttpStatus.UNAUTHORIZED, message: 'Unauthorized access. Please check your credentials.' });
//       client.disconnect();
//     } else if (exception instanceof BadRequestException) {
//       client.emit('exception', { status:HttpStatus.BAD_REQUEST, message: 'Please check your input.' });
//     }

//     // Suppress the console log or handle the error without logging
//     // Do not propagate the exception further or log it to the console
//     return; // Return early to avoid logging it
//   }
// }

// @WebSocketGateway({
//     cors: {
//       origin: '*',
//     },
// })
// @Injectable()
// export class EventsGateway {
//     @WebSocketServer()
//     server: Server; 
//     constructor(
//         readonly chatService:ChatService,
//         readonly messageService:MessageService,
//         readonly jwtService :JwtService,
//     ){}
//     //user socket and socket_id
//     private connectedUsers: Map<String, Socket> = new Map();
//     //Chat Room Id , Key Value of Pair of User ID with their socket id
//     private chatRooms : Map<string, Map<string,string>> = new Map(); 



//     @UseFilters(new AllExceptionsFilter())
//     async handleConnection(client: Socket, ...args: any[]) {
//         const token = this.extractTokenFromHeader(client);
//         if (!token) {
//           client.emit('unauthorized', {status:HttpStatus.UNAUTHORIZED, message: 'JWT token missing' });
//           client.disconnect();
//           return;
//         }
//         try {
//           const payload = await this.jwtService.verifyAsync(token, {
//             secret: jwtConstants.secret,
//           });
//           client['user'] = payload;
//         } catch (error) {
//           client.emit('unauthorized', {status:HttpStatus.UNAUTHORIZED, message: 'Invalid JWT Token' });
//           client.disconnect();
//           return;
//         }
//         console.log(`Client connected: ${client.id}`);
//         this.connectedUsers.set(client.id, client); // Add the socket to the list
//     }

//     @UseFilters(new AllExceptionsFilter())
//     handleDisconnect(client: Socket) {
//         console.log(`Client disconnected: ${client.id}`);
//         // Iterate through chatRooms to find the chat the client belongs to
//         this.chatRooms.forEach((userIdSocketMap: Map<string, string>, chatId: string) => {
//             // If the client is part of the current chat room
//             if (userIdSocketMap.has(client.id)) {
//                 console.log(`Client ${client.id} is part of chat room ${chatId}. Removing...`);
//                 userIdSocketMap.delete(client.id);  // Remove the client from the room
//             }
//         });
//         // Remove from the connected users map
//         this.connectedUsers.delete(client.id);  // Remove the socket from the list
//         console.log(`Client ${client.id} removed from connected users list.`);
//     }


//     @UseFilters(new AllExceptionsFilter())
//     @SubscribeMessage('sendAdditionalInfo')
//     async handleRetrieveInfo(@ConnectedSocket() client : Socket , @MessageBody() data: { sender_id: string,chat_id:string }): Promise<any> {
//         // console.log('Retrieve additional info for user:');
//         // console.log(data);
//         const {sender_id , chat_id} = data;
//         if (!sender_id || !chat_id) {
//             console.error('Invalid data received:', data);
//             return { error: 'Invalid data' };
//         }        
//         if(!this.chatRooms.get(chat_id)){
//             const userIdSocketMap : Map<string, string> = new Map();//socketids with users
//             userIdSocketMap.set(
//                 client.id,
//                 sender_id,
//             );
//             this.chatRooms.set(chat_id , userIdSocketMap);
//         }else{
//             const userIdSocketMap : Map<string, string> =  this.chatRooms.get(chat_id);
//             userIdSocketMap.set(
//                 client.id,
//                 sender_id,
//             );
//         }
//     }

//     @UseFilters(new AllExceptionsFilter())
//     @SubscribeMessage('events')
//     async handleEvent(@MessageBody() eventBody: { message: Message , chat_id:string}): Promise<any> {
//         await this.chatService.arePartOfChat(
//             eventBody.chat_id,
//             eventBody.message.sender_id,
//             eventBody.message.receiver_id
//         );
//         return eventBody;
//     }


//     @UseFilters(new AllExceptionsFilter())
//     @UseGuards(WsJwtAuthGuard)
//     @SubscribeMessage('send-message')
//     async handleSendMessage(@ConnectedSocket() client : Socket , @MessageBody() messagePayLoad: { message: Message , chat_id:string}): Promise<any> {
//         const {content, sender_id , receiver_id, message_type} = messagePayLoad.message;
//         const chat_id : string = messagePayLoad.chat_id;
//         await this.chatService.arePartOfChat(
//             chat_id,
//             sender_id,
//             receiver_id
//         );
//         if(!content)
//             5;
//             //add emit incase of error
//         const createdMessage  : Message = await this.messageService.createMessage(
//             message_type || 'text',
//             content,
//             sender_id,
//             receiver_id
//         );
//         const updatedChat : Chat= await this.chatService.sendMessage(chat_id , createdMessage);
//         //console.log("Updated Chat")
//         // console.log(updatedChat);

//         const userIdSocketMap = this.chatRooms.get(chat_id); // Assuming this is a Map of chat rooms and user socket mappings

//         if (userIdSocketMap) {
//             for (const [socketId, userId] of userIdSocketMap) {
//                 if (socketId !== client.id) {
//                     const recipientSocket = this.connectedUsers.get(socketId);
//                     if (recipientSocket) {
//                         // Emit the message to the recipient's socket
//                         recipientSocket.emit('newMessage', {
//                             message: createdMessage,
//                             chat_id: chat_id,
//                             sender_id: sender_id,
//                         });
//                     }
//                 }
//             }
//         }
//         return createdMessage;
//     }
    

//     @UseFilters(new AllExceptionsFilter())
//     @SubscribeMessage('offer')
//     async handleCallOffer(@ConnectedSocket() client : Socket, @MessageBody() offerBody: { offerSdp: string , chat_id:string , sender_id:string}): Promise<any> {
//         const {offerSdp,chat_id,sender_id} = offerBody;

//         if(this.chatRooms.has(chat_id)){
//             const userIdSocketMap : Map<String,String> = this.chatRooms.get(chat_id);
//             for(const [socketId,userId] of userIdSocketMap){
//                 if (socketId !== client.id) {
//                     const recipientSocket = this.connectedUsers.get(socketId);
//                     if(recipientSocket)
//                         recipientSocket.emit('offer', { offerSdp, sender_id, chat_id });
//                 }
//             }
//         }
//     }
//     @UseFilters(new AllExceptionsFilter())
//     @SubscribeMessage('answerOffer')
//     async handleAnswerOffer(@ConnectedSocket() client : Socket, @MessageBody() offerBody: { answerSdp: string , chat_id:string , sender_id:string}): Promise<any> {
//         const {answerSdp,chat_id,sender_id} = offerBody;

//         if(this.chatRooms.has(chat_id)){
//             const userIdSocketMap : Map<String,String> = this.chatRooms.get(chat_id);
//             for(const [socketId,userId] of userIdSocketMap){
//                 if (socketId !== client.id) {
//                     const recipientSocket = this.connectedUsers.get(socketId);
//                     if(recipientSocket)
//                         recipientSocket.emit('answerOffer', { answerSdp, sender_id, chat_id });
//                 }
//             }
//         }
//     }
    
//     @UseFilters(new AllExceptionsFilter())
//     @SubscribeMessage('ice')
//     async handleIce(@ConnectedSocket() client : Socket, @MessageBody() iceBody: { ice: string , chat_id:string , sender_id:string}): Promise<any> {
//         const {ice,chat_id,sender_id} = iceBody;

//         if(this.chatRooms.has(chat_id)){
//             const userIdSocketMap : Map<String,String> = this.chatRooms.get(chat_id);
//             for(const [socketId,userId] of userIdSocketMap){
//                 if (socketId !== client.id) {
//                     const recipientSocket = this.connectedUsers.get(socketId);
//                     if(recipientSocket)
//                         recipientSocket.emit('ice', { ice, sender_id, chat_id });
//                 }
//             }
//         }
//     }
//     @UseFilters(new AllExceptionsFilter())
//     @SubscribeMessage('sendIceCandidate')
//     async handleIceCandidate(
//         @ConnectedSocket() client: Socket,
//         @MessageBody() iceBody: { iceCandidate: RTCIceCandidate, chat_id: string, sender_id: string }
//     ): Promise<any> {
//         const { iceCandidate, chat_id, sender_id } = iceBody;

//         if (this.chatRooms.has(chat_id)) {
//             const userIdSocketMap: Map<String, String> = this.chatRooms.get(chat_id);
//             for (const [socketId, userId] of userIdSocketMap) {
//                 if (socketId !== client.id) {
//                     const recipientSocket = this.connectedUsers.get(socketId);
//                     if (recipientSocket) {
//                         recipientSocket.emit('receiveIceCandidate', { iceCandidate });
//                     }
//                 }
//             }
//         }
//     }



//     private extractTokenFromHeader(client: Socket): string {
//         const authHeadertoken = client.handshake.auth.token;
//         return authHeadertoken ? authHeadertoken.split(' ')[1] : null;
//     }
// }


