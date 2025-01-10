import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user-module';
import { ChatModule } from './chat/chat-module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    UserModule,ChatModule, AuthModule, EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
