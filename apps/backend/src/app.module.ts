import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { CasesModule } from './cases/cases.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ArticlesModule, CasesModule, HealthModule],
})
export class AppModule {}
