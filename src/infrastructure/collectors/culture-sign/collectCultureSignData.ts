import type { SignTermUpsertInput } from '../../../domain/sign/repositories/SignTermRepository.js';
import { CultureSignApiClient } from './CultureSignApiClient.js';
import { mapCultureSignItems } from './SignRecordMapper.js';
import {
  CULTURE_SIGN_DATASETS,
  type CollectSignDataOptions,
  type CollectSignDataResult,
  type CultureSignDataset,
} from './types.js';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function collectCultureSignRecords(
  options: CollectSignDataOptions,
): Promise<{ records: SignTermUpsertInput[]; summary: CollectSignDataResult }> {
  const client = new CultureSignApiClient();
  const pageSize = options.pageSize ?? 100;
  const requestDelayMs = options.requestDelayMs ?? 200;
  const datasets = options.datasets ?? CULTURE_SIGN_DATASETS;

  const allRecords: SignTermUpsertInput[] = [];
  const seen = new Set<string>();
  const summary: CollectSignDataResult = {
    datasets: [],
    totalRecords: 0,
  };

  for (const dataset of datasets) {
    const datasetSummary = await collectDataset(
      client,
      dataset,
      options.serviceKey,
      pageSize,
      requestDelayMs,
    );

    for (const record of datasetSummary.records) {
      const dedupeKey = `${record.id}`;
      if (seen.has(dedupeKey)) {
        continue;
      }
      seen.add(dedupeKey);
      allRecords.push(record);
    }

    summary.datasets.push({
      code: dataset.code,
      name: dataset.name,
      pages: datasetSummary.pages,
      rawItems: datasetSummary.rawItems,
      records: datasetSummary.records.length,
    });
  }

  summary.totalRecords = allRecords.length;
  return { records: allRecords, summary };
}

async function collectDataset(
  client: CultureSignApiClient,
  dataset: CultureSignDataset,
  serviceKey: string,
  pageSize: number,
  requestDelayMs: number,
): Promise<{ pages: number; rawItems: number; records: SignTermUpsertInput[] }> {
  const records: SignTermUpsertInput[] = [];
  let pageNo = 1;
  let pages = 0;
  let rawItems = 0;
  let totalCount = Number.POSITIVE_INFINITY;

  while ((pageNo - 1) * pageSize < totalCount) {
    const page = await client.fetchPage(dataset, serviceKey, pageNo, pageSize);
    pages += 1;
    rawItems += page.items.length;
    totalCount = page.totalCount;

    records.push(...mapCultureSignItems(page.items, dataset));

    if (page.items.length === 0) {
      break;
    }

    pageNo += 1;
    if (requestDelayMs > 0) {
      await sleep(requestDelayMs);
    }
  }

  return { pages, rawItems, records };
}
