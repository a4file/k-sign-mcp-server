export interface SignSearchResultDto {
  id: string;
  word: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
}

export interface SignDetailDto {
  id: string;
  word: string;
  meaning: string | null;
  category: string | null;
  handShape: string | null;
  movement: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  source: string | null;
}
