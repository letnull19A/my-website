import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import type { Article, Case, ArticlesSource, CasesSource } from '@my-website/schemas';

interface DbShape {
  articles: Article[];
  cases: Case[];
}

@Injectable()
export class DbService {
  private readonly data: DbShape;

  constructor() {
    this.data = this.loadDb();
  }

  private loadDb(): DbShape {
    const candidates = [
      path.join(process.cwd(), 'data', 'db.json'),
      path.join(__dirname, '..', '..', 'data', 'db.json'),
      path.join(__dirname, 'data', 'db.json'),
      path.join(process.cwd(), 'apps', 'backend', 'data', 'db.json'),
      path.join(__dirname, '..', '..', '..', 'data', 'db.json'),
    ];

    let raw: any = { articles: [], cases: [] };
    for (const p of candidates) {
      try {
        if (fs.existsSync(p)) {
          raw = JSON.parse(fs.readFileSync(p, 'utf-8'));
          break;
        }
      } catch {}
    }

    if (!raw.articles && !raw.cases) {
      try {
        const alt = path.join(__dirname, '..', '..', '..', '..', 'data', 'db.json');
        if (fs.existsSync(alt)) raw = JSON.parse(fs.readFileSync(alt, 'utf-8'));
      } catch {}
    }

    return {
      articles: (raw.articles ?? []) as Article[],
      cases: (raw.cases ?? []) as Case[],
    };
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
