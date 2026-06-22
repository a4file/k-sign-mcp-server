import { createSqliteDatabase } from './SqliteDatabase.js';
import { env } from '../../../config/env.js';

if (env.DB_PROVIDER !== 'sqlite') {
  console.error('Migration is only supported for SQLite in the current phase.');
  process.exit(1);
}

const db = createSqliteDatabase(env.SQLITE_PATH);
db.close();

console.log(`Database schema ready at ${env.SQLITE_PATH}`);
