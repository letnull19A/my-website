import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  ArticleSchema,
  CaseSchema,
  type Article,
  type Case,
  type ArticlesSource,
  type CasesSource,
} from '@my-website/schemas';
import { z } from 'zod';

const DbSchema = z.object({
  articles: z.array(ArticleSchema),
  cases: z.array(CaseSchema),
});

@Injectable()
export class DbService {
  private readonly logger = new Logger(DbService.name);
  private readonly data: z.infer<typeof DbSchema>;

  constructor() {
    this.data = this.loadDb();
  }

  private loadDb(): z.infer<typeof DbSchema> {
    const raw = this.readRawDb();

    const parsed = DbSchema.safeParse(raw);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ');
      throw new Error(`Invalid db.json — ${issues}`);
    }

    return parsed.data;
  }

  private readRawDb(): unknown {
    const candidates = [
      path.join(process.cwd(), 'data', 'db.json'),
      path.join(__dirname, '..', '..', 'data', 'db.json'),
      path.join(__dirname, 'data', 'db.json'),
    ];

    for (const p of candidates) {
      try {
        if (fs.existsSync(p)) {
          return JSON.parse(fs.readFileSync(p, 'utf-8'));
        }
      } catch (err) {
        this.logger.error(`Failed to read ${p}: ${String(err)}`);
      }
    }

    this.logger.warn('db.json not found — starting with empty collections');
    return { articles: [], cases: [] };
  }

  findAll(): Article[] {
    return this.data.articles;
  }

  findOne(slug: string): Article | undefined {
    return this.data.articles.find((a) => a.slug === slug);
  }

  findAllCases(): Case[] {
    return this.data.cases;
  }

  findOneCase(slug: string): Case | undefined {
    return this.data.cases.find((c) => c.slug === slug);
  }

  getArticlesSource(): ArticlesSource {
    return {
      findAll: () => this.findAll(),
      findOne: (slug: string) => this.findOne(slug),
    };
  }

  getCasesSource(): CasesSource {
    return {
      findAll: () => this.findAllCases(),
      findOne: (slug: string) => this.findOneCase(slug),
    };
  }
}
