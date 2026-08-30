import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ArticleDto } from './dto/article.dto';

@Injectable()
export class ArticlesService {
  private readonly articles: ArticleDto[];

  constructor() {
    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    // Fallback to __dirname/data/db.json when run from dist/
    const candidates = [
      dbPath,
      path.join(__dirname, '..', '..', 'data', 'db.json'),
      path.join(__dirname, 'data', 'db.json'),
      path.join(process.cwd(), 'apps', 'backend', 'data', 'db.json'),
    ];
    let data: any = { articles: [] };
    for (const p of candidates) {
      try {
        if (fs.existsSync(p)) {
          data = JSON.parse(fs.readFileSync(p, 'utf-8'));
          break;
        }
      } catch {}
    }
    // Also try relative to this file when built
    if (!data.articles) {
      try {
        const alt = path.join(__dirname, '..', '..', '..', 'data', 'db.json');
        if (fs.existsSync(alt)) data = JSON.parse(fs.readFileSync(alt, 'utf-8'));
      } catch {}
    }
    this.articles = (data.articles ?? []) as ArticleDto[];
  }

  findAll(): ArticleDto[] {
    return this.articles;
  }

  findOne(slug: string): ArticleDto {
    const found = this.articles.find((a) => a.slug === slug);
    if (!found) throw new NotFoundException(`Article with slug "${slug}" not found`);
    return found;
  }
}
