# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json vitest.config.ts ./
COPY src ./src
COPY tests ./tests

RUN npm run build
RUN npm test

FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV MCP_TRANSPORT=http
ENV HTTP_HOST=0.0.0.0
ENV HTTP_PORT=8000
ENV PORT=8000
ENV DB_PROVIDER=sqlite
ENV SQLITE_PATH=/app/data/ksign.db
ENV LOG_LEVEL=info
ENV SEARCH_RESULT_LIMIT=20
ENV COLLECT_ON_START=false
ENV COLLECT_PAGE_SIZE=100
ENV COLLECT_REQUEST_DELAY_MS=200
ENV USE_SAMPLE_DATA=false

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/infrastructure/persistence/sqlite/schema.sql ./dist/infrastructure/persistence/sqlite/schema.sql

RUN mkdir -p /app/data

# Pre-collected public sign data for KC Git deploy (no runtime env vars required).
COPY docker/seed/ksign.db /app/data/ksign.db

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
