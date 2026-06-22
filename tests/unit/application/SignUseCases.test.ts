import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { SqliteDatabase } from '../../../src/infrastructure/persistence/sqlite/SqliteDatabase.js';
import { createSqliteDatabase } from '../../../src/infrastructure/persistence/sqlite/SqliteDatabase.js';
import { SqliteSignTermRepository } from '../../../src/infrastructure/persistence/sqlite/SqliteSignTermRepository.js';
import { seedSignTerms } from '../../../src/infrastructure/persistence/sqlite/seed.js';
import { SearchSignUseCase } from '../../../src/application/sign/SearchSignUseCase.js';
import { GetSignDetailUseCase } from '../../../src/application/sign/GetSignDetailUseCase.js';
import { InvalidSearchKeywordError, SignNotFoundError } from '../../../src/domain/sign/errors/SignErrors.js';

describe('SearchSignUseCase', () => {
  let tempDir: string;
  let db: SqliteDatabase;
  let repository: SqliteSignTermRepository;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'ksign-test-'));
    const dbPath = join(tempDir, 'test.db');
    db = createSqliteDatabase(dbPath);
    seedSignTerms(db);
    repository = new SqliteSignTermRepository(db);
  });

  afterEach(() => {
    db.close();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('returns matching signs for a keyword', async () => {
    const useCase = new SearchSignUseCase(repository, 20);
    const results = await useCase.execute({ keyword: '학교' });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.word).toBe('학교');
    expect(results[0]?.description).toContain('교육기관');
  });

  it('throws when keyword is empty', async () => {
    const useCase = new SearchSignUseCase(repository, 20);
    await expect(useCase.execute({ keyword: '   ' })).rejects.toBeInstanceOf(
      InvalidSearchKeywordError,
    );
  });
});

describe('GetSignDetailUseCase', () => {
  let tempDir: string;
  let db: SqliteDatabase;
  let repository: SqliteSignTermRepository;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'ksign-test-'));
    const dbPath = join(tempDir, 'test.db');
    db = createSqliteDatabase(dbPath);
    seedSignTerms(db);
    repository = new SqliteSignTermRepository(db);
  });

  afterEach(() => {
    db.close();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('returns sign detail by id', async () => {
    const useCase = new GetSignDetailUseCase(repository);
    const detail = await useCase.execute({ signId: 'sign-001' });

    expect(detail.word).toBe('학교');
    expect(detail.meaning).toContain('교육기관');
    expect(detail.handShape).toBeTruthy();
  });

  it('throws SignNotFoundError for unknown id', async () => {
    const useCase = new GetSignDetailUseCase(repository);
    await expect(useCase.execute({ signId: 'unknown' })).rejects.toBeInstanceOf(
      SignNotFoundError,
    );
  });
});
