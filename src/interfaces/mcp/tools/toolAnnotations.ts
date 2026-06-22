import type { ToolAnnotations } from '@modelcontextprotocol/server';

/** Local SQLite lookup tools — read-only, closed-world, idempotent. */
export const readOnlyLookupToolAnnotations: ToolAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};
