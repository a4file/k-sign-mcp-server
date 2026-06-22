import type { Env } from '../../config/env.js';
import { GetSignDetailUseCase } from '../../application/sign/GetSignDetailUseCase.js';
import { SearchSignUseCase } from '../../application/sign/SearchSignUseCase.js';
import { createRepositoryFactory, type RepositoryFactory } from '../persistence/RepositoryFactory.js';

export interface AppContainer {
  env: Env;
  searchSignUseCase: SearchSignUseCase;
  getSignDetailUseCase: GetSignDetailUseCase;
  close(): void;
}

export function createAppContainer(env: Env): AppContainer {
  const repositories: RepositoryFactory = createRepositoryFactory(env);

  const searchSignUseCase = new SearchSignUseCase(
    repositories.signTermRepository,
    env.SEARCH_RESULT_LIMIT,
  );

  const getSignDetailUseCase = new GetSignDetailUseCase(repositories.signTermRepository);

  return {
    env,
    searchSignUseCase,
    getSignDetailUseCase,
    close: () => repositories.close(),
  };
}
