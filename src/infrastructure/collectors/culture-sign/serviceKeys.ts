import type { Env } from '../../../config/env.js';
import type { SignDatasetCode } from './types.js';

const DATASET_KEY_ENV: Record<SignDatasetCode, keyof Env> = {
  daily: 'DATA_GO_KR_SERVICE_KEY_DAILY',
  professional: 'DATA_GO_KR_SERVICE_KEY_PROFESSIONAL',
  culture: 'DATA_GO_KR_SERVICE_KEY_CULTURE',
  comprehensive: 'DATA_GO_KR_SERVICE_KEY_COMPREHENSIVE',
};

function hasAnyDatasetSpecificKey(env: Env): boolean {
  return Object.values(DATASET_KEY_ENV).some((envKey) => {
    const value = env[envKey];
    return typeof value === 'string' && value.trim().length > 0;
  });
}

export function resolveDatasetServiceKey(
  code: SignDatasetCode,
  env: Env,
): string | undefined {
  const specific = env[DATASET_KEY_ENV[code]];
  if (typeof specific === 'string' && specific.trim().length > 0) {
    return specific.trim();
  }

  if (hasAnyDatasetSpecificKey(env)) {
    return undefined;
  }

  const fallback = env.DATA_GO_KR_SERVICE_KEY;
  return typeof fallback === 'string' && fallback.trim().length > 0
    ? fallback.trim()
    : undefined;
}

export function resolveDatasetServiceKeys(
  env: Env,
): Partial<Record<SignDatasetCode, string>> {
  const keys: Partial<Record<SignDatasetCode, string>> = {};

  for (const code of Object.keys(DATASET_KEY_ENV) as SignDatasetCode[]) {
    const key = resolveDatasetServiceKey(code, env);
    if (key) {
      keys[code] = key;
    }
  }

  return keys;
}

export function hasAnyServiceKey(env: Env): boolean {
  return Object.keys(resolveDatasetServiceKeys(env)).length > 0;
}
