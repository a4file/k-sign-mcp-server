#!/bin/sh
set -e

if [ "$DB_PROVIDER" = "sqlite" ]; then
  node dist/infrastructure/persistence/sqlite/migrate.js
fi

exec "$@"
