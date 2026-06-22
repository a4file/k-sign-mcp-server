import { createSqliteDatabase } from '../../persistence/sqlite/SqliteDatabase.js';
import { SqliteSignTermRepository } from '../../persistence/sqlite/SqliteSignTermRepository.js';
import { seedSignTerms } from '../../persistence/sqlite/seed.js';
import { env } from '../../../config/env.js';
import { collectCultureSignRecords } from './collectCultureSignData.js';

export async function runSignDataCollection(): Promise<void> {
  const db = createSqliteDatabase(env.SQLITE_PATH);
  const repository = new SqliteSignTermRepository(db);

  try {
    if (env.DATA_GO_KR_SERVICE_KEY) {
      console.log('Collecting sign language data from public APIs...');
      const { records, summary } = await collectCultureSignRecords({
        serviceKey: env.DATA_GO_KR_SERVICE_KEY,
        pageSize: env.COLLECT_PAGE_SIZE,
        requestDelayMs: env.COLLECT_REQUEST_DELAY_MS,
      });

      if (records.length === 0) {
        throw new Error('No records were collected from public APIs.');
      }

      const saved = await repository.upsertMany(records);
      console.log(`Saved ${saved} sign terms into ${env.SQLITE_PATH}`);
      for (const dataset of summary.datasets) {
        console.log(
          `- ${dataset.name}: ${dataset.records} records (${dataset.rawItems} raw items, ${dataset.pages} pages)`,
        );
      }
      return;
    }

    if (env.USE_SAMPLE_DATA) {
      const count = seedSignTerms(db);
      console.log(`Seeded ${count} sample sign terms into ${env.SQLITE_PATH}`);
      return;
    }

    const existing = await repository.count();
    if (existing > 0) {
      console.log(`Database already has ${existing} sign terms. Skipping collection.`);
      return;
    }

    throw new Error(
      'DATA_GO_KR_SERVICE_KEY is not set. Apply for the culture sign APIs on https://www.data.go.kr and set the service key, or set USE_SAMPLE_DATA=true for local demo data.',
    );
  } finally {
    db.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runSignDataCollection().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
