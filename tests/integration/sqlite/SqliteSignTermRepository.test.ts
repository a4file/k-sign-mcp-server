import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { SqliteDatabase } from '../../../src/infrastructure/persistence/sqlite/SqliteDatabase.js';
import { createSqliteDatabase } from '../../../src/infrastructure/persistence/sqlite/SqliteDatabase.js';
import { SqliteSignTermRepository } from '../../../src/infrastructure/persistence/sqlite/SqliteSignTermRepository.js';
import { seedSignTerms } from '../../../src/infrastructure/persistence/sqlite/seed.js';

describe('SqliteSignTermRepository', () => {
  let tempDir: string;
  let db: SqliteDatabase;
  let repository: SqliteSignTermRepository;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'ksign-repo-'));
    const dbPath = join(tempDir, 'test.db');
    db = createSqliteDatabase(dbPath);
    seedSignTerms(db);
    repository = new SqliteSignTermRepository(db);
  });

  afterEach(() => {
    db.close();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('searches signs by keyword using FTS', async () => {
    const results = await repository.searchByKeyword('안녕', { limit: 10 });
    expect(results.some((sign) => sign.word === '안녕하세요')).toBe(true);
  });

  it('falls back to LIKE search when FTS has no match', async () => {
    const results = await repository.searchByKeyword('학교', { limit: 10 });
    expect(results.some((sign) => sign.word === '학교')).toBe(true);
  });

  it('finds sign by id', async () => {
    const sign = await repository.findById('sign-002');
    expect(sign?.word).toBe('가다');
  });

  it('returns null for unknown id', async () => {
    const sign = await repository.findById('does-not-exist');
    expect(sign).toBeNull();
  });
});
