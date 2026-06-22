import { InvalidSearchKeywordError } from '../../domain/sign/errors/SignErrors.js';
import type { SignTermRepository } from '../../domain/sign/repositories/SignTermRepository.js';
import type { SignSearchResultDto } from './dto/SignDtos.js';

export interface SearchSignInput {
  keyword: string;
  limit?: number;
}

export class SearchSignUseCase {
  constructor(
    private readonly signTermRepository: SignTermRepository,
    private readonly defaultLimit: number,
  ) {}

  async execute(input: SearchSignInput): Promise<SignSearchResultDto[]> {
    const keyword = input.keyword.trim();
    if (!keyword) {
      throw new InvalidSearchKeywordError();
    }

    const limit = input.limit ?? this.defaultLimit;
    const signs = await this.signTermRepository.searchByKeyword(keyword, { limit });

    return signs.map((sign) => ({
      id: sign.id,
      word: sign.word,
      description: sign.description,
      imageUrl: sign.imageUrl,
      videoUrl: sign.videoUrl,
    }));
  }
}
