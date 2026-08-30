import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CaseActionDto {
  @ApiProperty({ example: 'view' })
  id!: string;

  @ApiProperty({ example: 'VIEW CASE' })
  label!: string;

  @ApiProperty({ example: '/cases/speka' })
  href!: string;

  @ApiPropertyOptional({
    enum: ['default', 'lime-light', 'outline', 'secondary', 'ghost'],
    example: 'lime-light',
  })
  variant?: string;
}

export class CaseMetaDto {
  @ApiProperty({ example: 'FULL-STACK DEVELOPER' })
  role!: string;

  @ApiProperty({ example: '3 MONTHS' })
  duration!: string;

  @ApiProperty({ example: 'PRODUCTION' })
  status!: string;

  @ApiProperty({ example: 'REACT / NEXT.JS / NESTJS / POSTGRESQL' })
  stack!: string;
}

export class CaseDto {
  @ApiProperty({ example: 'speka', pattern: '^[a-z0-9-]+$' })
  slug!: string;

  @ApiProperty({ example: 'SPEKA' })
  title!: string;

  @ApiProperty({ example: 'FULLSTACK' })
  role!: string;

  @ApiProperty({ example: 'A client-facing specification editor...' })
  description!: string;

  @ApiProperty({
    example: 'A CLIENT-FACING SPECIFICATION EDITOR DESIGNED AROUND PROGRESS TRANSPARENCY.',
  })
  fullTitle!: string;

  @ApiProperty({ example: 'A client-facing specification editor...' })
  subtitle!: string;

  @ApiProperty({ type: [CaseActionDto] })
  actions!: CaseActionDto[];

  @ApiProperty({ type: CaseMetaDto })
  meta!: CaseMetaDto;

  @ApiProperty({ example: 'Lorem ipsum dolor sit amet...' })
  problem!: string;

  @ApiProperty({ example: 'Lorem ipsum dolor sit amet...' })
  solution!: string;

  @ApiProperty({ example: 'Lorem ipsum dolor sit amet...' })
  results!: string;

  @ApiProperty({ example: '/icons/speka-logo.svg' })
  logo!: string;

  @ApiPropertyOptional({ example: '/images/process-step-1.webp', nullable: true })
  previewImage?: string | null;

  @ApiPropertyOptional({
    example: 'FIGMA/DEV-001 // Speka Interactive workspace matrix',
    nullable: true,
  })
  previewCaption?: string | null;
}

export class CaseListResponseDto {
  @ApiProperty({ type: [CaseDto] })
  items!: CaseDto[];
}

export class CaseItemResponseDto {
  @ApiProperty({ type: CaseDto })
  item!: CaseDto;
}
