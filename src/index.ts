#!/usr/bin/env node
import { env } from './config/env.js';
import { createAppContainer } from './infrastructure/di/container.js';
import { Logger } from './infrastructure/logging/Logger.js';
import { startHttpTransport, startStdioTransport } from './infrastructure/transport/startServer.js';

async function main(): Promise<void> {
  const logger = new Logger(env.LOG_LEVEL);
  const container = createAppContainer(env);

  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down`);
    await close();
    process.exit(0);
  };

  let close = async () => {
    container.close();
  };

  try {
    if (env.MCP_TRANSPORT === 'http') {
      const httpServer = await startHttpTransport(container, logger);
      close = httpServer.close;
    } else {
      const stdioServer = await startStdioTransport(container, logger);
      close = stdioServer.close;
    }

    process.on('SIGINT', () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
  } catch (error) {
    logger.error('Failed to start server', {
      error: error instanceof Error ? error.message : String(error),
    });
    await close();
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
