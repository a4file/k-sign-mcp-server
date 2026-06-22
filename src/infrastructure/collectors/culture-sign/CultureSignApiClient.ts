import { XMLParser } from 'fast-xml-parser';
import { kcisaFetch } from './kcisaFetch.js';
import type {
  CultureSignApiItem,
  CultureSignApiPage,
  CultureSignDataset,
} from './types.js';

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
});

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const RETRYABLE_HTTP_STATUSES = new Set([408, 429, 500, 502, 503, 504]);
const MAX_PAGE_RETRIES = 5;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientFetchError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const code = (error as NodeJS.ErrnoException).code;
  const causeCode = (error.cause as NodeJS.ErrnoException | undefined)?.code;
  return (
    code === 'ETIMEDOUT' ||
    code === 'ECONNRESET' ||
    code === 'ECONNREFUSED' ||
    code === 'EAI_AGAIN' ||
    causeCode === 'ETIMEDOUT' ||
    causeCode === 'ECONNRESET'
  );
}

export class CultureSignApiClient {
  constructor(private readonly fetchImpl: typeof fetch = kcisaFetch) {}

  async fetchPage(
    dataset: CultureSignDataset,
    serviceKey: string,
    pageNo: number,
    numOfRows: number,
  ): Promise<CultureSignApiPage> {
    const url = new URL(dataset.endpoint);
    url.searchParams.set('serviceKey', serviceKey);
    url.searchParams.set('numOfRows', String(numOfRows));
    url.searchParams.set('pageNo', String(pageNo));
    // KCISA requires keyword= even when empty (see culture.go.kr API guide).
    url.searchParams.set('keyword', '');

    if (dataset.extraQueryParams) {
      for (const [key, value] of Object.entries(dataset.extraQueryParams)) {
        url.searchParams.set(key, value);
      }
    }

    const requestInit: RequestInit = {
      headers: {
        Accept: 'application/xml, application/json, text/xml, */*',
      },
    };

    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= MAX_PAGE_RETRIES; attempt++) {
      try {
        const response = await this.fetchImpl(url, requestInit);
        const body = await response.text();

        if (!response.ok) {
          const error = new Error(
            this.formatHttpError(dataset.code, pageNo, response.status, body),
          );

          if (RETRYABLE_HTTP_STATUSES.has(response.status) && attempt < MAX_PAGE_RETRIES) {
            lastError = error;
            await sleep(500 * attempt);
            continue;
          }

          throw error;
        }

        return this.parseResponse(body, pageNo, numOfRows);
      } catch (error) {
        if (isTransientFetchError(error) && attempt < MAX_PAGE_RETRIES) {
          lastError = error instanceof Error ? error : new Error(String(error));
          await sleep(500 * attempt);
          continue;
        }

        throw error;
      }
    }

    throw lastError ?? new Error(`Culture sign API request failed (${dataset.code}, page ${pageNo})`);
  }

  private formatHttpError(
    datasetCode: string,
    pageNo: number,
    status: number,
    body: string,
  ): string {
    const trimmed = body.trim();
    if (trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed) as { message?: string };
        if (parsed.message) {
          return `Culture sign API request failed (${datasetCode}, page ${pageNo}): ${parsed.message}`;
        }
      } catch {
        // fall through to generic message
      }
    }

    return `Culture sign API request failed (${datasetCode}, page ${pageNo}): HTTP ${status}`;
  }

  parseResponse(body: string, pageNo: number, numOfRows: number): CultureSignApiPage {
    const trimmed = body.trim();

    if (trimmed.startsWith('{')) {
      return this.parseJsonResponse(trimmed, pageNo, numOfRows);
    }

    return this.parseXmlResponse(trimmed, pageNo, numOfRows);
  }

  private parseJsonResponse(body: string, pageNo: number, numOfRows: number): CultureSignApiPage {
    const parsed = JSON.parse(body) as {
      response?: {
        header?: { resultCode?: string; resultMsg?: string };
        body?: {
          items?: { item?: CultureSignApiItem | CultureSignApiItem[] };
          totalCount?: string | number;
        };
      };
    };

    const header = parsed.response?.header;
    if (header?.resultCode && String(header.resultCode) !== '0000') {
      throw new Error(`Culture sign API error: ${header.resultCode} ${header.resultMsg ?? ''}`.trim());
    }

    const items = asArray(parsed.response?.body?.items?.item);
    return {
      items,
      totalCount: toNumber(parsed.response?.body?.totalCount, items.length),
      pageNo,
      numOfRows,
    };
  }

  private parseXmlResponse(body: string, pageNo: number, numOfRows: number): CultureSignApiPage {
    const parsed = parser.parse(body) as {
      response?: {
        header?: { resultCode?: string; resultMsg?: string };
        body?: {
          items?: { item?: CultureSignApiItem | CultureSignApiItem[] };
          totalCount?: string | number;
        };
      };
    };

    const header = parsed.response?.header;
    if (header?.resultCode && String(header.resultCode) !== '0000') {
      throw new Error(`Culture sign API error: ${header.resultCode} ${header.resultMsg ?? ''}`.trim());
    }

    const items = asArray(parsed.response?.body?.items?.item);
    return {
      items,
      totalCount: toNumber(parsed.response?.body?.totalCount, items.length),
      pageNo,
      numOfRows,
    };
  }
}
