import { describe, it, expect } from 'vitest';
import {
  hasAnyServiceKey,
  resolveDatasetServiceKey,
  resolveDatasetServiceKeys,
} from '../../../src/infrastructure/collectors/culture-sign/serviceKeys.js';
import type { Env } from '../../../src/config/env.js';

function env(overrides: Partial<Env>): Env {
  return {
    NODE_ENV: 'test',
    LOG_LEVEL: 'info',
    MCP_TRANSPORT: 'stdio',
    MCP_SERVER_NAME: 'k-sign-mcp-server',
    MCP_SERVER_VERSION: '0.1.0',
    HTTP_HOST: '0.0.0.0',
    HTTP_PORT: 8000,
    DB_PROVIDER: 'sqlite',
    SQLITE_PATH: './data/ksign.db',
    SEARCH_RESULT_LIMIT: 20,
    KCISA_API_IP_FALLBACK: '175.125.91.8',
    COLLECT_ON_START: false,
    COLLECT_PAGE_SIZE: 100,
    COLLECT_REQUEST_DELAY_MS: 200,
    USE_SAMPLE_DATA: false,
    ...overrides,
  };
}

describe('serviceKeys', () => {
  it('uses a single fallback key for all datasets', () => {
    const config = env({ DATA_GO_KR_SERVICE_KEY: 'shared-key' });

    expect(resolveDatasetServiceKeys(config)).toEqual({
      daily: 'shared-key',
      professional: 'shared-key',
      culture: 'shared-key',
      comprehensive: 'shared-key',
    });
  });

  it('uses only configured per-dataset keys without fallback', () => {
    const config = env({
      DATA_GO_KR_SERVICE_KEY: 'shared-key',
      DATA_GO_KR_SERVICE_KEY_CULTURE: 'culture-key',
      DATA_GO_KR_SERVICE_KEY_DAILY: 'daily-key',
    });

    expect(resolveDatasetServiceKeys(config)).toEqual({
      culture: 'culture-key',
      daily: 'daily-key',
    });
    expect(resolveDatasetServiceKey('professional', config)).toBeUndefined();
  });

  it('detects whether any key is configured', () => {
    expect(hasAnyServiceKey(env({}))).toBe(false);
    expect(hasAnyServiceKey(env({ DATA_GO_KR_SERVICE_KEY_COMPREHENSIVE: 'x' }))).toBe(true);
  });
});
