import { createHash } from 'node:crypto';
import type { SignTermUpsertInput } from '../../../domain/sign/repositories/SignTermRepository.js';
import type { CultureSignApiItem, CultureSignDataset } from './types.js';

function normalizeMediaUrl(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith('/')) {
    return `https://sldict.korean.go.kr${trimmed}`;
  }

  return trimmed;
}

function pickImageUrl(item: CultureSignApiItem): string | null {
  const signImage = item.signImages
    ?.split(',')
    .map((part) => part.trim())
    .find(Boolean);

  return normalizeMediaUrl(signImage ?? item.url);
}

function pickVideoUrl(item: CultureSignApiItem): string | null {
  return normalizeMediaUrl(item.subDescription);
}

function cleanProfessionalTitle(title: string): string {
  return title
    .replace(/\s*\[[^\]]*]\s*/g, '')
    .replace(/[\p{Script=Han}]/gu, '')
    .replace(/[^a-zA-Z0-9ㄱ-ㅎ가-힣\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function expandTitles(item: CultureSignApiItem, dataset: CultureSignDataset): string[] {
  const rawTitle = item.title?.trim();
  if (!rawTitle) {
    return [];
  }

  const titles = dataset.splitTitles
    ? rawTitle.split(',').map((part) => part.trim()).filter(Boolean)
    : [rawTitle.replace(/\s+/g, '')];

  if (!dataset.cleanProfessionalTitle) {
    return titles;
  }

  return titles
    .map(cleanProfessionalTitle)
    .filter((title) => title.length > 0);
}

function buildRecordId(dataset: CultureSignDataset, item: CultureSignApiItem, word: string): string {
  const reference = item.referenceIdentifier?.trim();
  if (reference) {
    return `ksign-${dataset.code}-${reference}`;
  }

  const hash = createHash('sha1').update(`${dataset.code}:${word}:${item.subDescription ?? ''}`).digest('hex');
  return `ksign-${dataset.code}-${hash.slice(0, 12)}`;
}

export function mapCultureSignItem(
  item: CultureSignApiItem,
  dataset: CultureSignDataset,
): SignTermUpsertInput[] {
  const words = expandTitles(item, dataset);
  if (words.length === 0) {
    return [];
  }

  const imageUrl = pickImageUrl(item);
  const videoUrl = pickVideoUrl(item);
  const description = item.description?.trim() || item.signDescription?.trim() || null;
  const handShape = item.signDescription?.trim() || null;
  const category = item.subjectCategory?.trim() || item.subjectKeyword?.trim() || null;

  return words.map((word) => ({
    id: buildRecordId(dataset, item, word),
    word,
    category,
    description,
    handShape,
    movement: null,
    imageUrl,
    videoUrl,
    source: dataset.name,
  }));
}

export function mapCultureSignItems(
  items: CultureSignApiItem[],
  dataset: CultureSignDataset,
): SignTermUpsertInput[] {
  const records: SignTermUpsertInput[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    for (const record of mapCultureSignItem(item, dataset)) {
      const dedupeKey = `${record.word}::${record.videoUrl ?? ''}`;
      if (seen.has(dedupeKey)) {
        continue;
      }
      seen.add(dedupeKey);
      records.push(record);
    }
  }

  return records;
}
