import { describe, it, expect } from 'vitest';
import { mapCultureSignItem } from '../../../src/infrastructure/collectors/culture-sign/SignRecordMapper.js';
import { CULTURE_SIGN_DATASETS } from '../../../src/infrastructure/collectors/culture-sign/types.js';

describe('SignRecordMapper', () => {
  const dailyDataset = CULTURE_SIGN_DATASETS[0]!;
  const professionalDataset = CULTURE_SIGN_DATASETS[1]!;
  const cultureDataset = CULTURE_SIGN_DATASETS[2]!;

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
    expect(records[0]?.source).toBe('국립국어원 일상생활 수어');
  });

  it('maps professional sign fields (signImages, subDescription video, categoryType)', () => {
    const records = mapCultureSignItem(
      {
        title: '죄',
        description: '하나님의 계명을 거역하고 그의 명령을 따르지 아니하는 인간의 행위.',
        referenceIdentifier:
          'http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20160325/290045/MOV000284091_215X161.jpg',
        subDescription:
          'http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20160325/290045/MOV000284091_700X466.mp4',
        signDescription: '오른 주먹의 5지를 펴서 끝을 코 오른쪽에 댔다가 왼 손바닥에 내려 세운다.',
        signImages:
          'http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20160325/267770/IMG000284092_700X466.jpg',
        categoryType: '기독교',
      },
      professionalDataset,
    );

    expect(records).toHaveLength(1);
    expect(records[0]?.word).toBe('죄');
    expect(records[0]?.imageUrl).toContain('IMG000284092');
    expect(records[0]?.videoUrl).toContain('MOV000284091_700X466.mp4');
    expect(records[0]?.handShape).toContain('오른 주먹');
    expect(records[0]?.category).toBe('기독교');
    expect(records[0]?.id).toMatch(/^ksign-professional-[0-9a-f]{16}$/);
  });

  it('maps culture-info sign fields (referenceIdentifier image, subDescription video)', () => {
    const records = mapCultureSignItem(
      {
        title: '설매와 설피',
        description: '겨울철 설피에 대한 설명',
        referenceIdentifier:
          'http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20190214/532188/MOV000355695_215X161.jpg',
        subDescription:
          'http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20190214/532188/MOV000355695_700X466.mp4',
        categoryType: '국립 춘천 박물관',
      },
      cultureDataset,
    );

    expect(records).toHaveLength(1);
    expect(records[0]?.word).toBe('설매와 설피');
    expect(records[0]?.imageUrl).toContain('_215X161.jpg');
    expect(records[0]?.videoUrl).toContain('_700X466.mp4');
    expect(records[0]?.category).toBe('국립 춘천 박물관');
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
