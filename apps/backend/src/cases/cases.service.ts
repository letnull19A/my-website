import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CaseDto } from './dto/case.dto';

@Injectable()
export class CasesService {
  private readonly cases: CaseDto[];

  constructor() {
    const candidates = [
      path.join(process.cwd(), 'data', 'db.json'),
      path.join(__dirname, '..', '..', 'data', 'db.json'),
      path.join(__dirname, 'data', 'db.json'),
      path.join(process.cwd(), 'apps', 'backend', 'data', 'db.json'),
    ];
    let data: any = { cases: [] };
    for (const p of candidates) {
      try {
        if (fs.existsSync(p)) {
          data = JSON.parse(fs.readFileSync(p, 'utf-8'));
          break;
        }
      } catch {}
    }
    if (!data.cases) {
      try {
        const alt = path.join(__dirname, '..', '..', '..', 'data', 'db.json');
        if (fs.existsSync(alt)) data = JSON.parse(fs.readFileSync(alt, 'utf-8'));
      } catch {}
    }
    this.cases = (data.cases ?? []) as CaseDto[];
  }

  findAll(): CaseDto[] {
    return this.cases;
  }

  findOne(slug: string): CaseDto {
    const found = this.cases.find((c) => c.slug === slug);
    if (!found) throw new NotFoundException(`Case with slug "${slug}" not found`);
    return found;
  }
}
