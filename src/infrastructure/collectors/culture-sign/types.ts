export interface CultureSignDataset {
  code: 'daily' | 'professional' | 'culture';
  name: string;
  endpoint: string;
  splitTitles: boolean;
  cleanProfessionalTitle: boolean;
}

export const CULTURE_SIGN_DATASETS: CultureSignDataset[] = [
  {
    code: 'daily',
    name: '문화체육관광부 일상생활 수어',
    endpoint: 'https://api.kcisa.kr/openapi/service/rest/meta13/getCTE01701',
    splitTitles: true,
    cleanProfessionalTitle: false,
  },
  {
    code: 'professional',
    name: '문화체육관광부 전문용어 수어',
    endpoint: 'https://api.kcisa.kr/openapi/service/rest/meta13/getCTE01702',
    splitTitles: true,
    cleanProfessionalTitle: true,
  },
  {
    code: 'culture',
    name: '문화체육관광부 문화정보 수어',
    endpoint: 'https://api.kcisa.kr/openapi/service/rest/meta13/getCTE01703',
    splitTitles: false,
    cleanProfessionalTitle: false,
  },
];

export interface CultureSignApiItem {
  title?: string;
  alternativeTitle?: string;
  description?: string;
  subjectCategory?: string;
  subjectKeyword?: string;
  url?: string;
  subDescription?: string;
  signDescription?: string;
  signImages?: string;
  referenceIdentifier?: string;
}

export interface CultureSignApiPage {
  items: CultureSignApiItem[];
  totalCount: number;
  pageNo: number;
  numOfRows: number;
}

export interface CollectSignDataOptions {
  serviceKey: string;
  pageSize?: number;
  requestDelayMs?: number;
  datasets?: CultureSignDataset[];
}

export interface CollectSignDataResult {
  datasets: Array<{
    code: string;
    name: string;
    pages: number;
    rawItems: number;
    records: number;
  }>;
  totalRecords: number;
}
