import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArticleDto {
  @ApiProperty({
    example: 'ui-syntax-and-styleguide',
    pattern: '^[a-z0-9-]+$',
    description: 'Уникальный slug, часть URL: /articles/{slug}',
  })
  slug!: string;

  @ApiProperty({ example: 'UI DESIGN SYSTEM & MARKDOWN SYNTAX DEMO' })
  title!: string;

  @ApiProperty({
    example: 'Complete showcase of all typography, lists, code blocks...',
    description: 'Короткое описание для карточки (2–3 строки)',
  })
  description!: string;

  @ApiProperty({
    example: 'A reference specification demonstrating headers...',
    description: 'Заголовок детальной страницы (H1)',
  })
  subtitle!: string;

  @ApiProperty({
    example: '2026-08-10',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
    description: 'ISO 8601: YYYY-MM-DD',
  })
  date!: string;

  @ApiProperty({ example: '4 MIN READ' })
  readTime!: string;

  @ApiProperty({ example: 'DESIGN SYSTEM // SPEC' })
  category!: string;

  @ApiProperty({
    description: 'Markdown-контент статьи (GFM)',
    example: '# 1. Main Section Heading\n\nParagraph...',
  })
  content!: string;

  @ApiPropertyOptional({
    example: '/images/stack-cube-frontend.webp',
    nullable: true,
    type: String,
  })
  coverImage!: string | null;

  @ApiPropertyOptional({
    example: 'https://www.linkedin.com/in/your-profile/',
    nullable: true,
    type: String,
  })
  linkedinHref?: string | null;

  @ApiPropertyOptional({
    example: 'https://t.me/your_channel',
    nullable: true,
    type: String,
  })
  telegramHref?: string | null;
}

export class ArticleListResponseDto {
  @ApiProperty({ type: [ArticleDto] })
  items!: ArticleDto[];
}

export class ArticleItemResponseDto {
  @ApiProperty({ type: ArticleDto })
  item!: ArticleDto;
}
