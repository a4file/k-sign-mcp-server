import { SignNotFoundError } from '../../domain/sign/errors/SignErrors.js';
import type { SignTermRepository } from '../../domain/sign/repositories/SignTermRepository.js';
import type { SignDetailDto } from './dto/SignDtos.js';

export interface GetSignDetailInput {
  signId: string;
}

export class GetSignDetailUseCase {
  constructor(private readonly signTermRepository: SignTermRepository) {}

  async execute(input: GetSignDetailInput): Promise<SignDetailDto> {
    const sign = await this.signTermRepository.findById(input.signId.trim());
    if (!sign) {
      throw new SignNotFoundError(input.signId);
    }

    return {
      id: sign.id,
      word: sign.word,
      meaning: sign.description,
      category: sign.category,
      handShape: sign.handShape,
      movement: sign.movement,
      imageUrl: sign.imageUrl,
      videoUrl: sign.videoUrl,
      source: sign.source,
    };
  }
}
