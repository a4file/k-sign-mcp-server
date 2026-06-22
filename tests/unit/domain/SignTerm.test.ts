import { describe, it, expect } from 'vitest';
import { SignTerm } from '../../../src/domain/sign/entities/SignTerm.js';

describe('SignTerm', () => {
  it('creates an immutable sign term entity', () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const sign = new SignTerm({
      id: 'sign-001',
      word: '학교',
      category: '일상생활',
      description: '교육기관',
      handShape: '주먹',
      movement: '앞으로',
      imageUrl: 'https://example.com/school.png',
      videoUrl: 'https://example.com/school.mp4',
      source: '문화체육관광부',
      createdAt,
    });

    expect(sign.id).toBe('sign-001');
    expect(sign.word).toBe('학교');
    expect(sign.createdAt).toEqual(createdAt);
  });
});
