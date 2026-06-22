export type SignDatasetCode = 'daily' | 'professional' | 'culture' | 'comprehensive';

export interface CultureSignDataset {
  code: SignDatasetCode;
  name: string;
  endpoint: string;
  splitTitles: boolean;
  cleanProfessionalTitle: boolean;
  extraQueryParams?: Record<string, string>;
}

export const CULTURE_SIGN_DATASETS: CultureSignDataset[] = [
  {
    code: 'daily',
    name: '국립국어원 일상생활 수어',
    endpoint: 'http://api.kcisa.kr/openapi/service/rest/meta13/getCTE01701',
    splitTitles: true,
    cleanProfessionalTitle: false,
  },
  {
    code: 'professional',
    name: '국립국어원 전문용어 수어',
    endpoint: 'http://api.kcisa.kr/openapi/service/rest/meta13/getCTE01702',
    splitTitles: true,
    cleanProfessionalTitle: true,
  },
  {
    code: 'culture',
    name: '국립국어원 문화정보 수어',
    endpoint: 'http://api.kcisa.kr/openapi/service/rest/meta13/getCTE01703',
    splitTitles: false,
    cleanProfessionalTitle: false,
  },
  {
    code: 'comprehensive',
    name: '국립국어원 통합 수어정보',
    endpoint: 'http://api.kcisa.kr/API_CNV_054/request',
    splitTitles: true,
    cleanProfessionalTitle: false,
    extraQueryParams: { collectionDb: '' },
  },
];

export interface CultureSignApiItem {
  title?: string;
  alternativeTitle?: string;
  description?: string;
  subjectCategory?: string;
  subjectKeyword?: string;
  categoryType?: string;
  collectionDb?: string;
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
  serviceKeys: Partial<Record<SignDatasetCode, string>>;
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
