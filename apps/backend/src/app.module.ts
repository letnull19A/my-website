import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { TrpcModule } from './trpc/trpc.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [DbModule, TrpcModule, HealthModule],
})
export class AppModule {}
