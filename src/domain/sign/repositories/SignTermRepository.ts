import type { SignTerm } from '../entities/SignTerm.js';

export interface SignSearchOptions {
  limit: number;
}

export interface SignTermRepository {
  searchByKeyword(keyword: string, options: SignSearchOptions): Promise<SignTerm[]>;
  findById(id: string): Promise<SignTerm | null>;
}
