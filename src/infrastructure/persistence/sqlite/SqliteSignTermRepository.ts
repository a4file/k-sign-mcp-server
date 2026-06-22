import type { SqliteDatabase } from './SqliteDatabase.js';
import { SignTerm } from '../../../domain/sign/entities/SignTerm.js';
import type {
  SignSearchOptions,
  SignTermRepository,
} from '../../../domain/sign/repositories/SignTermRepository.js';

interface SignTermRow {
  id: string;
  word: string;
  category: string | null;
  description: string | null;
  hand_shape: string | null;
  movement: string | null;
  image_url: string | null;
  video_url: string | null;
  source: string | null;
  created_at: string;
}

function mapRowToEntity(row: SignTermRow): SignTerm {
  return new SignTerm({
    id: row.id,
    word: row.word,
    category: row.category,
    description: row.description,
    handShape: row.hand_shape,
    movement: row.movement,
    imageUrl: row.image_url,
    videoUrl: row.video_url,
    source: row.source,
    createdAt: new Date(row.created_at),
  });
}

const FTS_SELECT_COLUMNS = `s.id, s.word, s.category, s.description, s.hand_shape, s.movement,
  s.image_url, s.video_url, s.source, s.created_at`;

const BASE_SELECT_COLUMNS = `id, word, category, description, hand_shape, movement,
  image_url, video_url, source, created_at`;

export class SqliteSignTermRepository implements SignTermRepository {
  constructor(private readonly db: SqliteDatabase) {}

  async searchByKeyword(keyword: string, options: SignSearchOptions): Promise<SignTerm[]> {
    const ftsQuery = keyword
      .trim()
      .split(/\s+/)
      .map((token) => `"${token.replace(/"/g, '""')}"*`)
      .join(' ');

    const rows = this.db
      .prepare(
        `
        SELECT ${FTS_SELECT_COLUMNS}
        FROM sign_terms_fts fts
        JOIN sign_terms s ON s.rowid = fts.rowid
        WHERE sign_terms_fts MATCH ?
        ORDER BY rank
        LIMIT ?
      `,
      )
      .all(ftsQuery, options.limit) as SignTermRow[];

    if (rows.length > 0) {
      return rows.map(mapRowToEntity);
    }

    const likePattern = `%${keyword}%`;
    const fallbackRows = this.db
      .prepare(
        `
        SELECT id, word, category, description, hand_shape, movement,
               image_url, video_url, source, created_at
        FROM sign_terms
        WHERE word LIKE ? OR description LIKE ?
        ORDER BY word ASC
        LIMIT ?
      `,
      )
      .all(likePattern, likePattern, options.limit) as SignTermRow[];

    return fallbackRows.map(mapRowToEntity);
  }

  async findById(id: string): Promise<SignTerm | null> {
    const row = this.db
      .prepare(`SELECT ${BASE_SELECT_COLUMNS} FROM sign_terms WHERE id = ?`)
      .get(id) as SignTermRow | undefined;

    return row ? mapRowToEntity(row) : null;
  }
}
