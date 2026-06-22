import type { SignTerm } from '../entities/SignTerm.js';

export interface SignSearchOptions {
  limit: number;
}

export interface SignTermUpsertInput {
  id: string;
  word: string;
  category: string | null;
  description: string | null;
  handShape: string | null;
  movement: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  source: string | null;
}

export interface SignTermRepository {
  searchByKeyword(keyword: string, options: SignSearchOptions): Promise<SignTerm[]>;
  findById(id: string): Promise<SignTerm | null>;
  upsertMany(records: SignTermUpsertInput[]): Promise<number>;
  count(): Promise<number>;
}
