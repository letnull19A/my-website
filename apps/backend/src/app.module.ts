import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { TrpcModule } from './trpc/trpc.module';
import { HealthModule } from './health/health.module';
import { AiChatModule } from './ai-chat/ai-chat.module';

@Module({
  imports: [DbModule, TrpcModule, HealthModule, AiChatModule],
})
export class AppModule {}
