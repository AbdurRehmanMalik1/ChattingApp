import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './message-model';
import { UserSchema } from 'src/user/user-model';
import { ChatSchema } from './chat-model';
import { UserController } from 'src/user/user-controller';
import { UserService } from 'src/user/user-service';
import { ChatController } from './chat-controller';
import { ChatService } from './chat-service';
import { MessageService } from './message-service';

@Module({
  imports:[
    MongooseModule.forFeature(
        [
            { name: 'User', schema: UserSchema },
            { name: 'Message', schema: MessageSchema },
            { name: 'Chat', schema: ChatSchema },
        ]), 
  ],
  exports:[
    ChatService,
    MessageService,
  ],
  controllers: [UserController,ChatController],
  providers: [UserService,ChatService,MessageService],
})
export class ChatModule {}
