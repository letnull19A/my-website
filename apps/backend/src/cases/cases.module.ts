import { Module } from '@nestjs/common';
import { CasesController, CasesAliasController } from './cases.controller';
import { CasesService } from './cases.service';

@Module({
  controllers: [CasesController, CasesAliasController],
  providers: [CasesService],
})
export class CasesModule {}
