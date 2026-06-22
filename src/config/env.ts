import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

loadDotenv();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  MCP_TRANSPORT: z.enum(['stdio', 'http']).default('stdio'),
  MCP_SERVER_NAME: z.string().default('k-sign-mcp-server'),
  MCP_SERVER_VERSION: z.string().default('0.1.0'),
  HTTP_HOST: z.string().default('0.0.0.0'),
  HTTP_PORT: z.coerce.number().int().positive().default(8000),
  DB_PROVIDER: z.enum(['sqlite', 'postgres']).default('sqlite'),
  SQLITE_PATH: z.string().default('./data/ksign.db'),
  POSTGRES_URL: z.string().optional(),
  SEARCH_RESULT_LIMIT: z.coerce.number().int().positive().default(20),
  DATA_GO_KR_SERVICE_KEY: z.string().optional(),
  DATA_GO_KR_SERVICE_KEY_DAILY: z.string().optional(),
  DATA_GO_KR_SERVICE_KEY_PROFESSIONAL: z.string().optional(),
  DATA_GO_KR_SERVICE_KEY_CULTURE: z.string().optional(),
  DATA_GO_KR_SERVICE_KEY_COMPREHENSIVE: z.string().optional(),
  KCISA_API_IP_FALLBACK: z.string().default('175.125.91.8'),
  COLLECT_ON_START: z.coerce.boolean().default(false),
  COLLECT_PAGE_SIZE: z.coerce.number().int().positive().default(100),
  COLLECT_REQUEST_DELAY_MS: z.coerce.number().int().nonnegative().default(200),
  USE_SAMPLE_DATA: z.coerce.boolean().default(false),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  // Kubernetes / PlayMCP in KC injects PORT; honor it over HTTP_PORT
  const mergedEnv = {
    ...process.env,
    HTTP_PORT: process.env.PORT ?? process.env.HTTP_PORT,
  };

  const result = envSchema.safeParse(mergedEnv);
  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${formatted}`);
  }

  if (result.data.DB_PROVIDER === 'postgres' && !result.data.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is required when DB_PROVIDER=postgres');
  }

  return result.data;
}

export const env = parseEnv();
