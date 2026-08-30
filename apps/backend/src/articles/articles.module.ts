import { Module } from '@nestjs/common';
import { ArticlesController, ArticlesAliasController } from './articles.controller';
import { ArticlesService } from './articles.service';

@Module({
  controllers: [ArticlesController, ArticlesAliasController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
