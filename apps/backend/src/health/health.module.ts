import { Module } from '@nestjs/common';
import { HealthController, HealthAliasController } from './health.controller';

@Module({
  controllers: [HealthController, HealthAliasController],
})
export class HealthModule {}
