#!/bin/sh
set -e

SEED_DB=/app/seed/ksign.db
TARGET_DB="${SQLITE_PATH:-/app/data/ksign.db}"

mkdir -p "$(dirname "$TARGET_DB")"

if [ -f "$SEED_DB" ]; then
  if [ ! -f "$TARGET_DB" ] || [ ! -s "$TARGET_DB" ]; then
    cp "$SEED_DB" "$TARGET_DB"
    echo "Initialized database from seed at $TARGET_DB"
  fi
fi

if [ "$DB_PROVIDER" = "sqlite" ]; then
  node dist/infrastructure/persistence/sqlite/migrate.js

  node -e "
    const Database = require('better-sqlite3');
    const db = new Database(process.env.SQLITE_PATH || '$TARGET_DB', { readonly: true });
    const row = db.prepare('SELECT COUNT(*) AS count FROM sign_terms').get();
    db.close();
    const count = row?.count ?? 0;
    console.log('Sign terms in database:', count);
    if (count === 0) {
      console.error('ERROR: sign database is empty — search will not work.');
      process.exit(1);
    }
  "

  if [ -n "$DATA_GO_KR_SERVICE_KEY" ] \
    || [ -n "$DATA_GO_KR_SERVICE_KEY_DAILY" ] \
    || [ -n "$DATA_GO_KR_SERVICE_KEY_PROFESSIONAL" ] \
    || [ -n "$DATA_GO_KR_SERVICE_KEY_CULTURE" ] \
    || [ -n "$DATA_GO_KR_SERVICE_KEY_COMPREHENSIVE" ] \
    || [ "$USE_SAMPLE_DATA" = "true" ]; then
    if [ "$COLLECT_ON_START" = "true" ] || [ "$USE_SAMPLE_DATA" = "true" ]; then
      node dist/infrastructure/collectors/culture-sign/collect.js || {
        echo "Warning: sign data collection failed; starting with existing database." >&2
      }
    fi
  fi
fi

exec "$@"
