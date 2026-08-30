import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CaseItemResponseDto, CaseListResponseDto } from './dto/case.dto';

@ApiTags('cases')
@Controller('api/v1/cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  @ApiOperation({ summary: 'List cases', operationId: 'listCases' })
  @ApiResponse({ status: 200, type: CaseListResponseDto })
  findAll(): CaseListResponseDto {
    return { items: this.casesService.findAll() };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get case by slug', operationId: 'getCaseBySlug' })
  @ApiParam({ name: 'slug', example: 'speka', schema: { pattern: '^[a-z0-9-]+$' } })
  @ApiResponse({ status: 200, type: CaseItemResponseDto })
  @ApiResponse({ status: 404, description: 'Case not found' })
  findOne(@Param('slug') slug: string): CaseItemResponseDto {
    return { item: this.casesService.findOne(slug) };
  }
}

@ApiTags('cases')
@Controller('cases')
export class CasesAliasController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  @ApiOperation({ summary: 'List cases (alias)' })
  @ApiResponse({ status: 200, type: CaseListResponseDto })
  findAll(): CaseListResponseDto {
    return { items: this.casesService.findAll() };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get case by slug (alias)' })
  @ApiParam({ name: 'slug', example: 'speka', schema: { pattern: '^[a-z0-9-]+$' } })
  @ApiResponse({ status: 200, type: CaseItemResponseDto })
  findOne(@Param('slug') slug: string): CaseItemResponseDto {
    return { item: this.casesService.findOne(slug) };
  }
}
