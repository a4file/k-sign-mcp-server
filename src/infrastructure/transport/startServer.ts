import { randomUUID } from 'node:crypto';
import { McpServer, StdioServerTransport } from '@modelcontextprotocol/server';
import { NodeStreamableHTTPServerTransport } from '@modelcontextprotocol/node';
import Fastify from 'fastify';
import type { AppContainer } from '../di/container.js';
import type { Logger } from '../logging/Logger.js';
import { createMcpServer } from '../../interfaces/mcp/createMcpServer.js';

export async function startStdioTransport(
  container: AppContainer,
  logger: Logger,
): Promise<{ server: McpServer; close: () => Promise<void> }> {
  const server = createMcpServer(container);
  const transport = new StdioServerTransport();

  await server.connect(transport);
  logger.info('MCP server started (stdio transport)');

  return {
    server,
    close: async () => {
      await server.close();
      container.close();
    },
  };
}

export async function startHttpTransport(
  container: AppContainer,
  logger: Logger,
): Promise<{ close: () => Promise<void> }> {
  type Session = {
    transport: NodeStreamableHTTPServerTransport;
    server: McpServer;
  };

  const sessions = new Map<string, Session>();

  const fastify = Fastify({
    logger: container.env.LOG_LEVEL === 'debug',
  });

  fastify.get('/health', async () => ({
    status: 'ok',
    service: container.env.MCP_SERVER_NAME,
    version: container.env.MCP_SERVER_VERSION,
  }));

  fastify.all('/mcp', async (request, reply) => {
    const sessionId = request.headers['mcp-session-id'] as string | undefined;

    if (request.method === 'GET') {
      if (!sessionId || !sessions.has(sessionId)) {
        return reply.status(400).send({ error: 'Invalid or missing mcp-session-id' });
      }
      const session = sessions.get(sessionId)!;
      await session.transport.handleRequest(request.raw, reply.raw);
      return;
    }

    if (request.method === 'POST') {
      if (sessionId && sessions.has(sessionId)) {
        const session = sessions.get(sessionId)!;
        await session.transport.handleRequest(request.raw, reply.raw, request.body);
        return;
      }

      const transport = new NodeStreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
      });
      const server = createMcpServer(container);

      transport.onclose = () => {
        const id = transport.sessionId;
        if (id) {
          const session = sessions.get(id);
          if (session) {
            void session.server.close();
            sessions.delete(id);
          }
        }
      };

      await server.connect(transport);
      await transport.handleRequest(request.raw, reply.raw, request.body);

      if (transport.sessionId) {
        sessions.set(transport.sessionId, { transport, server });
      }
      return;
    }

    if (request.method === 'DELETE') {
      if (!sessionId || !sessions.has(sessionId)) {
        return reply.status(400).send({ error: 'Invalid or missing mcp-session-id' });
      }
      const session = sessions.get(sessionId)!;
      await session.transport.handleRequest(request.raw, reply.raw);
      await session.server.close();
      sessions.delete(sessionId);
      return;
    }

    return reply.status(405).send({ error: 'Method not allowed' });
  });

  const address = await fastify.listen({
    host: container.env.HTTP_HOST,
    port: container.env.HTTP_PORT,
  });

  logger.info('MCP server started (http transport)', { address });

  return {
    close: async () => {
      for (const session of sessions.values()) {
        await session.transport.close();
        await session.server.close();
      }
      sessions.clear();
      await fastify.close();
      container.close();
    },
  };
}
