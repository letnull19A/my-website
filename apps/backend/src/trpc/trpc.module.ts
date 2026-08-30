import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { TrpcService } from './trpc.service';

@Module({
  imports: [DbModule],
  providers: [TrpcService],
  exports: [TrpcService],
})
export class TrpcModule {}
