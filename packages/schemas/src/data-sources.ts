import type { Article } from './article';
import type { Case } from './case';

export interface ArticlesSource {
  findAll(): Article[];
  findOne(slug: string): Article | undefined;
}

export interface CasesSource {
  findAll(): Case[];
  findOne(slug: string): Case | undefined;
}

export interface DataSources {
  articles: ArticlesSource;
  cases: CasesSource;
}
