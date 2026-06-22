import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/server';
import type { SearchSignUseCase } from '../../../application/sign/SearchSignUseCase.js';
import {
  DomainError,
  InvalidSearchKeywordError,
  SignNotFoundError,
} from '../../../domain/sign/errors/SignErrors.js';
import { readOnlyLookupToolAnnotations } from './toolAnnotations.js';

const searchSignInputSchema = z.object({
  keyword: z.string().min(1, 'keyword is required'),
});

const searchSignOutputSchema = z.object({
  results: z.array(
    z.object({
      id: z.string(),
      word: z.string(),
      description: z.string().nullable(),
      imageUrl: z.string().nullable(),
      videoUrl: z.string().nullable(),
    }),
  ),
});

export function registerSearchSignTool(
  server: McpServer,
  searchSignUseCase: SearchSignUseCase,
): void {
  server.registerTool(
    'search_sign',
    {
      title: '수어 검색',
      description: '사용자가 입력한 한국어 단어에 해당하는 수어 정보를 검색합니다.',
      inputSchema: searchSignInputSchema,
      outputSchema: searchSignOutputSchema,
      annotations: readOnlyLookupToolAnnotations,
    },
    async ({ keyword }) => {
      try {
        const results = await searchSignUseCase.execute({ keyword });
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({ results }, null, 2),
            },
          ],
          structuredContent: { results },
        };
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}

function formatToolError(error: unknown): {
  content: Array<{ type: 'text'; text: string }>;
  isError: true;
} {
  if (error instanceof InvalidSearchKeywordError) {
    return {
      content: [{ type: 'text', text: error.message }],
      isError: true,
    };
  }

  if (error instanceof DomainError) {
    return {
      content: [{ type: 'text', text: error.message }],
      isError: true,
    };
  }

  const message = error instanceof Error ? error.message : 'Unknown error';
  return {
    content: [{ type: 'text', text: `Internal error: ${message}` }],
    isError: true,
  };
}

export { formatToolError, SignNotFoundError };
