import { createSqliteDatabase, type SqliteDatabase } from './sqlite/SqliteDatabase.js';
import { SqliteSignTermRepository } from './sqlite/SqliteSignTermRepository.js';
import { PostgresSignTermRepository } from './postgres/PostgresSignTermRepository.js';
import type { SignTermRepository } from '../../domain/sign/repositories/SignTermRepository.js';
import type { Env } from '../../config/env.js';

export interface RepositoryFactory {
  signTermRepository: SignTermRepository;
  close(): void;
}

export function createRepositoryFactory(env: Env): RepositoryFactory {
  if (env.DB_PROVIDER === 'postgres') {
    const signTermRepository = new PostgresSignTermRepository(env.POSTGRES_URL!);
    return {
      signTermRepository,
      close: () => undefined,
    };
  }

  const db: SqliteDatabase = createSqliteDatabase(env.SQLITE_PATH);
  const signTermRepository = new SqliteSignTermRepository(db);

  return {
    signTermRepository,
    close: () => db.close(),
  };
}
