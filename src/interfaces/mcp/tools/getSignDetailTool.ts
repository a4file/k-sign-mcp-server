import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/server';
import type { GetSignDetailUseCase } from '../../../application/sign/GetSignDetailUseCase.js';
import { SignNotFoundError } from '../../../domain/sign/errors/SignErrors.js';
import { formatToolError } from './searchSignTool.js';
import { readOnlyLookupToolAnnotations } from './toolAnnotations.js';

const getSignDetailInputSchema = z.object({
  signId: z.string().min(1, 'signId is required'),
});

const getSignDetailOutputSchema = z.object({
  id: z.string(),
  word: z.string(),
  meaning: z.string().nullable(),
  category: z.string().nullable(),
  handShape: z.string().nullable(),
  movement: z.string().nullable(),
  imageUrl: z.string().nullable(),
  videoUrl: z.string().nullable(),
  source: z.string().nullable(),
});

export function registerGetSignDetailTool(
  server: McpServer,
  getSignDetailUseCase: GetSignDetailUseCase,
): void {
  server.registerTool(
    'get_sign_detail',
    {
      title: '수어 상세 조회',
      description: '특정 수어의 상세 정보를 반환합니다.',
      inputSchema: getSignDetailInputSchema,
      outputSchema: getSignDetailOutputSchema,
      annotations: readOnlyLookupToolAnnotations,
    },
    async ({ signId }) => {
      try {
        const detail = await getSignDetailUseCase.execute({ signId });
        const response = {
          word: detail.word,
          meaning: detail.meaning,
          handShape: detail.handShape,
          movement: detail.movement,
          imageUrl: detail.imageUrl,
          videoUrl: detail.videoUrl,
          category: detail.category,
          source: detail.source,
          id: detail.id,
        };

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(response, null, 2),
            },
          ],
          structuredContent: response,
        };
      } catch (error) {
        if (error instanceof SignNotFoundError) {
          return {
            content: [{ type: 'text', text: error.message }],
            isError: true,
          };
        }
        return formatToolError(error);
      }
    },
  );
}
