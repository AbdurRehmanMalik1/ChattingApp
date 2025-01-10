import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsController } from './events.controller';
import { ChatModule } from 'src/chat/chat-module';

@Module({
  imports:[ChatModule],
  providers: [EventsGateway],
  controllers: [EventsController],

})
export class EventsModule {}
