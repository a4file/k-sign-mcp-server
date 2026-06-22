import { XMLParser } from 'fast-xml-parser';
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

export class CultureSignApiClient {
  constructor(private readonly fetchImpl: typeof fetch = fetch) {}

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

    const response = await this.fetchImpl(url, {
      headers: {
        Accept: 'application/xml, application/json, text/xml, */*',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Culture sign API request failed (${dataset.code}, page ${pageNo}): HTTP ${response.status}`,
      );
    }

    const body = await response.text();
    return this.parseResponse(body, pageNo, numOfRows);
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
