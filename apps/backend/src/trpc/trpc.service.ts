import { Injectable } from '@nestjs/common';
import { appRouter } from '@my-website/api';
import { DbService } from '../db/db.service';

@Injectable()
export class TrpcService {
  public readonly router = appRouter;

  constructor(private readonly db: DbService) {}

  createContext = () => {
    return {
      dataSources: {
        articles: this.db.getArticlesSource(),
        cases: this.db.getCasesSource(),
      },
    };
  };
}
