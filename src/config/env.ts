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
  HTTP_PORT: z.coerce.number().int().positive().default(3000),
  DB_PROVIDER: z.enum(['sqlite', 'postgres']).default('sqlite'),
  SQLITE_PATH: z.string().default('./data/ksign.db'),
  POSTGRES_URL: z.string().optional(),
  SEARCH_RESULT_LIMIT: z.coerce.number().int().positive().default(20),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);
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
