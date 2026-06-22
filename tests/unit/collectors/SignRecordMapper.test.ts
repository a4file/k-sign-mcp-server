import { describe, it, expect } from 'vitest';
import { mapCultureSignItem } from '../../../src/infrastructure/collectors/culture-sign/SignRecordMapper.js';
import { CULTURE_SIGN_DATASETS } from '../../../src/infrastructure/collectors/culture-sign/types.js';

describe('SignRecordMapper', () => {
  const dailyDataset = CULTURE_SIGN_DATASETS[0]!;

  it('splits comma-separated titles and maps media URLs', () => {
    const records = mapCultureSignItem(
      {
        title: '안녕하세요,반갑습니다',
        description: '인사 표현',
        subjectCategory: '인간',
        signDescription: '손바닥을 펴서 가볍게 흔든다',
        signImages: 'http://sldict.korean.go.kr/multimedia/sign.jpg',
        subDescription: 'http://sldict.korean.go.kr/multimedia/sign.mp4',
        referenceIdentifier: 'CTE0001',
      },
      dailyDataset,
    );

    expect(records).toHaveLength(2);
    expect(records[0]?.word).toBe('안녕하세요');
    expect(records[0]?.imageUrl).toContain('sldict.korean.go.kr');
    expect(records[0]?.videoUrl).toContain('.mp4');
    expect(records[0]?.handShape).toContain('손바닥');
    expect(records[0]?.source).toBe('문화체육관광부 일상생활 수어');
  });

  it('normalizes relative media paths', () => {
    const records = mapCultureSignItem(
      {
        title: '학교',
        signImages: '/multimedia/sign.jpg',
        subDescription: '/multimedia/sign.mp4',
        referenceIdentifier: 'CTE0002',
      },
      dailyDataset,
    );

    expect(records[0]?.imageUrl).toBe('https://sldict.korean.go.kr/multimedia/sign.jpg');
    expect(records[0]?.videoUrl).toBe('https://sldict.korean.go.kr/multimedia/sign.mp4');
  });
});
