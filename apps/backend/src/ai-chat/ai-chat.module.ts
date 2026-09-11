import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { AiChatController } from './ai-chat.controller';
import { AiChatService } from './ai-chat.service';

@Module({
  imports: [DbModule],
  controllers: [AiChatController],
  providers: [AiChatService],
})
export class AiChatModule {}
