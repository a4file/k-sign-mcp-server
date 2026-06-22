#!/bin/sh
set -e

if [ "$DB_PROVIDER" = "sqlite" ]; then
  node dist/infrastructure/persistence/sqlite/migrate.js

  if [ -n "$DATA_GO_KR_SERVICE_KEY" ] || [ "$COLLECT_ON_START" = "true" ] || [ "$USE_SAMPLE_DATA" = "true" ]; then
    node dist/infrastructure/collectors/culture-sign/collect.js
  fi
fi

exec "$@"
