import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import {
  ArticleDto,
  ArticleItemResponseDto,
  ArticleListResponseDto,
} from './dto/article.dto';

@ApiTags('articles')
@Controller('api/v1/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'List articles', operationId: 'listArticles' })
  @ApiResponse({ status: 200, type: ArticleListResponseDto })
  findAll(): ArticleListResponseDto {
    const items = this.articlesService.findAll();
    return { items };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get article by slug', operationId: 'getArticleBySlug' })
  @ApiParam({ name: 'slug', example: 'ui-syntax-and-styleguide', schema: { pattern: '^[a-z0-9-]+$' } })
  @ApiResponse({ status: 200, type: ArticleItemResponseDto })
  @ApiResponse({ status: 404, description: 'Article not found' })
  findOne(@Param('slug') slug: string): ArticleItemResponseDto {
    const item = this.articlesService.findOne(slug);
    return { item };
  }
}

// Plain (without /api/v1) aliases for backward compat / direct json-server style
@ApiTags('articles')
@Controller('articles')
export class ArticlesAliasController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'List articles (alias without prefix)' })
  @ApiResponse({ status: 200, type: ArticleListResponseDto })
  findAll(): ArticleListResponseDto {
    return { items: this.articlesService.findAll() };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get article by slug (alias)' })
  @ApiParam({ name: 'slug', example: 'ui-syntax-and-styleguide', schema: { pattern: '^[a-z0-9-]+$' } })
  @ApiResponse({ status: 200, type: ArticleItemResponseDto })
  findOne(@Param('slug') slug: string): ArticleItemResponseDto {
    return { item: this.articlesService.findOne(slug) };
  }
}
