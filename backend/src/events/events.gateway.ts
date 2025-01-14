import { ArgumentsHost, BadRequestException, Catch, HttpStatus, Injectable, UnauthorizedException, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseWsExceptionFilter, ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { jwtConstants } from 'src/auth/constants';
import { WsJwtAuthGuard } from 'src/auth/ws-auth-guard';
import { Chat } from 'src/chat/chat-model';
import { ChatService } from 'src/chat/chat-service';
import { Message } from 'src/chat/message-model';
import { MessageService } from 'src/chat/message-service';
import { JoinMultipleRoomsDto } from 'src/dto/join-multiple-room-dto';
import { JoinRoomDto } from 'src/dto/join-room-dto';

@Catch(UnauthorizedException, BadRequestException, WsException)
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    
    // Check if exception is an instance of UnauthorizedException
    if (exception instanceof UnauthorizedException) {
      client.emit('unauthorized', {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized access. Please check your credentials.',
      });
      client.disconnect(); // Optional: disconnect the client if unauthorized
    }
    
    // Check if exception is an instance of BadRequestException
    else if (exception instanceof BadRequestException) {
      const response = exception.getResponse(); // Get the response from BadRequestException
      client.emit('exception', {
        status: HttpStatus.BAD_REQUEST,
        message: 'Bad Request. Please check your input.',
        errors: response['message'] || [],
      });
    }
    
    // Handle WsException without calling getError
    else if (exception instanceof WsException) {
      const response = exception.getError(); // This should work now without errors
      client.emit('exception', {
        status: HttpStatus.BAD_REQUEST,
        message: 'A WebSocket error occurred.',
        errors: response || [],
      });
    }
  }
}
@WebSocketGateway({
    cors: {
      origin: '*',
    },
})
@UseFilters(new AllExceptionsFilter())
@Injectable()
export class EventsGateway {
    @WebSocketServer()
    server: Server; 
    constructor(
        readonly chatService:ChatService,
        readonly messageService:MessageService,
        readonly jwtService :JwtService,
    ){
    }
    async handleConnection(client: Socket) {
        const token = this.extractTokenFromHeader(client);
        if (!token) {
            client.emit('exception', { status: HttpStatus.UNAUTHORIZED, message: 'JWT token missing' });
            client.disconnect();
            return;
        }
    
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });
            client['user'] = payload;
        } catch (error) {
            client.emit('exception', { status: HttpStatus.UNAUTHORIZED, message: 'Invalid JWT Token' });
            client.disconnect();
            return;
        }
        console.log(`Client connected: ${client.id}`);
    }
    
    async handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        // Socket.IO handles room cleanup automatically
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @ConnectedSocket() client: Socket, 
        @MessageBody(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true, })) data: JoinRoomDto) 
    {
      const { chatId } = data;
      client.join(chatId);
      console.log(`Client ${client.id} joined room: ${chatId}`);
    }

    @SubscribeMessage('joinMultipleRooms')
    handleJoinMultipleRooms(
        @ConnectedSocket() client: Socket, 
        @MessageBody(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true, })) data: JoinMultipleRoomsDto,
    ) {
      const { chatIds } = data;
      chatIds.forEach((chatId:string)=>{
        client.join(chatId);
        console.log(`Client ${client.id} joined room: ${chatId}`);
      });
    }

    
    @SubscribeMessage('send-message')
    async handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: { chatId: string, message: Message }) {
        const { chatId, message } = payload;
        await this.chatService.arePartOfChat(chatId, message.sender_id, message.receiver_id);
        const createdMessage : Message = await this.messageService.createMessage(
            message.message_type || 'text',
            message.content,
            message.sender_id,
            message.receiver_id,
        );
        const senderName = this.getUserName(client);
        this.server.to(chatId).except(client.id).emit('newMessage', { 
            message: createdMessage, 
            chatId ,
            senderName
        });
        return createdMessage;
    }
    
    @SubscribeMessage('offer')
    handleCallOffer(
        @ConnectedSocket() client: Socket,
        @MessageBody() offerBody: { offerSdp: string; chatId: string }
    ): void {
        const senderId = this.getUserId(client);
        
        const { offerSdp, chatId } = offerBody;

        client.to(chatId).emit('offer', { offerSdp, senderId, chatId });
    }

    @SubscribeMessage('answerOffer')
    handleAnswerOffer(
        @ConnectedSocket() client: Socket,
        @MessageBody() offerBody: { answerSdp: string; chatId: string }
    ): void {
        const senderId = this.getUserId(client);
        const { answerSdp, chatId } = offerBody;

        // Emit the answer offer to the chat room
        client.to(chatId).emit('answerOffer', { answerSdp, senderId, chatId });
    }

    @SubscribeMessage('sendIceCandidate')
    handleIceCandidate(
        @ConnectedSocket() client: Socket,
        @MessageBody() iceBody: { iceCandidate: RTCIceCandidateInit; chatId: string }
    ): void {
        const senderId = this.getUserId(client);
        const { iceCandidate, chatId } = iceBody;


        client.to(chatId).emit('receiveIceCandidate', { iceCandidate, senderId, chatId });
        console.log(`Sending ICE candidate from ${senderId} to ${chatId}`);
    }

    private extractTokenFromHeader(client: Socket): string {
        const authHeadertoken = client.handshake.auth.token;
        return authHeadertoken ? authHeadertoken.split(' ')[1] : null;
    }
    private getUserId(client: Socket): string {
        return client['user']?.sub;  
    }
    private getUserName(client: Socket): string {
        return client['user']?.name;  
    }
    private getUserEmail(client: Socket): string {
        return client['user']?.email;  
    }
}


