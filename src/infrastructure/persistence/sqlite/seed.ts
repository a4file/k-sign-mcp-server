import type { SqliteDatabase } from './SqliteDatabase.js';
import { createSqliteDatabase } from './SqliteDatabase.js';
import { env } from '../../../config/env.js';

export interface SeedSignTerm {
  id: string;
  word: string;
  category?: string;
  description?: string;
  handShape?: string;
  movement?: string;
  imageUrl?: string;
  videoUrl?: string;
  source?: string;
}

export const SAMPLE_SIGN_TERMS: SeedSignTerm[] = [
  {
    id: 'sign-001',
    word: '학교',
    category: '일상생활',
    description: '교육기관을 의미하는 수어',
    handShape: '주먹을 쥔 손',
    movement: '손등을 위로 향하게 하여 앞으로 이동',
    imageUrl: 'https://example.com/signs/school.png',
    videoUrl: 'https://example.com/signs/school.mp4',
    source: '문화체육관광부 일상생활 수어 데이터',
  },
  {
    id: 'sign-002',
    word: '가다',
    category: '동작',
    description: '한 곳에서 다른 곳으로 이동함',
    handShape: '검지·중지를 편 손',
    movement: '앞으로 이동하는 동작',
    imageUrl: 'https://example.com/signs/go.png',
    videoUrl: 'https://example.com/signs/go.mp4',
    source: '문화체육관광부 일상생활 수어 데이터',
  },
  {
    id: 'sign-003',
    word: '나',
    category: '대명사',
    description: '화자 자신을 가리키는 수어',
    handShape: '검지를 편 손',
    movement: '가슴을 가리킴',
    imageUrl: 'https://example.com/signs/me.png',
    videoUrl: 'https://example.com/signs/me.mp4',
    source: '문화체육관광부 일상생활 수어 데이터',
  },
  {
    id: 'sign-004',
    word: '안녕하세요',
    category: '인사',
    description: '상대방에게 인사할 때 사용하는 수어',
    handShape: '손바닥을 편 손',
    movement: '손을 가볍게 흔듦',
    imageUrl: 'https://example.com/signs/hello.png',
    videoUrl: 'https://example.com/signs/hello.mp4',
    source: '한국수어사전',
  },
  {
    id: 'sign-005',
    word: '감사합니다',
    category: '인사',
    description: '고마움을 표현하는 수어',
    handShape: '손바닥을 편 손',
    movement: '가슴 앞에서 앞으로 이동',
    imageUrl: 'https://example.com/signs/thanks.png',
    videoUrl: 'https://example.com/signs/thanks.mp4',
    source: '한국수어사전',
  },
];

export function seedSignTerms(db: SqliteDatabase, terms: SeedSignTerm[] = SAMPLE_SIGN_TERMS): number {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO sign_terms (
      id, word, category, description, hand_shape, movement,
      image_url, video_url, source, created_at
    ) VALUES (
      @id, @word, @category, @description, @handShape, @movement,
      @imageUrl, @videoUrl, @source, datetime('now')
    )
  `);

  const insertMany = db.transaction((items: SeedSignTerm[]) => {
    for (const term of items) {
      insert.run({
        id: term.id,
        word: term.word,
        category: term.category ?? null,
        description: term.description ?? null,
        handShape: term.handShape ?? null,
        movement: term.movement ?? null,
        imageUrl: term.imageUrl ?? null,
        videoUrl: term.videoUrl ?? null,
        source: term.source ?? null,
      });
    }
  });

  insertMany(terms);
  return terms.length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const db = createSqliteDatabase(env.SQLITE_PATH);
  const count = seedSignTerms(db);
  db.close();
  console.log(`Seeded ${count} sign terms into ${env.SQLITE_PATH}`);
}
