import { McpServer } from '@modelcontextprotocol/server';
import type { AppContainer } from '../../infrastructure/di/container.js';
import { registerGetSignDetailTool } from './tools/getSignDetailTool.js';
import { registerSearchSignTool } from './tools/searchSignTool.js';

export function createMcpServer(container: AppContainer): McpServer {
  const server = new McpServer({
    name: container.env.MCP_SERVER_NAME,
    version: container.env.MCP_SERVER_VERSION,
  });

  registerSearchSignTool(server, container.searchSignUseCase);
  registerGetSignDetailTool(server, container.getSignDetailUseCase);

  return server;
}
