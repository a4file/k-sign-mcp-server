import type { SignTerm } from '../../../domain/sign/entities/SignTerm.js';
import type {
  SignSearchOptions,
  SignTermRepository,
} from '../../../domain/sign/repositories/SignTermRepository.js';

/**
 * PostgreSQL repository stub for future migration.
 * Implement when DB_PROVIDER=postgres is enabled in production.
 */
export class PostgresSignTermRepository implements SignTermRepository {
  constructor(private readonly connectionUrl: string) {
    void this.connectionUrl;
  }

  async searchByKeyword(_keyword: string, _options: SignSearchOptions): Promise<SignTerm[]> {
    throw new Error(
      'PostgreSQL repository is not yet implemented. Set DB_PROVIDER=sqlite or implement PostgresSignTermRepository.',
    );
  }

  async findById(_id: string): Promise<SignTerm | null> {
    throw new Error(
      'PostgreSQL repository is not yet implemented. Set DB_PROVIDER=sqlite or implement PostgresSignTermRepository.',
    );
  }
}
