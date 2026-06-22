import { describe, it, expect } from 'vitest';
import { CultureSignApiClient } from '../../../src/infrastructure/collectors/culture-sign/CultureSignApiClient.js';

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <header>
    <resultCode>0000</resultCode>
    <resultMsg>OK</resultMsg>
  </header>
  <body>
    <items>
      <item>
        <title>안녕하세요</title>
        <description>인사</description>
        <signImages>http://sldict.korean.go.kr/multimedia/sign.jpg</signImages>
        <subDescription>http://sldict.korean.go.kr/multimedia/sign.mp4</subDescription>
        <referenceIdentifier>CTE0001</referenceIdentifier>
      </item>
    </items>
    <totalCount>1</totalCount>
  </body>
</response>`;

describe('CultureSignApiClient', () => {
  it('parses XML responses', () => {
    const client = new CultureSignApiClient();
    const page = client.parseResponse(SAMPLE_XML, 1, 100);

    expect(page.totalCount).toBe(1);
    expect(page.items[0]?.title).toBe('안녕하세요');
    expect(page.items[0]?.subDescription).toContain('.mp4');
  });

  it('retries transient HTTP errors before failing', async () => {
    let attempts = 0;
    const fetchMock = async () => {
      attempts += 1;
      if (attempts < 3) {
        return new Response('', { status: 504 });
      }
      return new Response(SAMPLE_XML, { status: 200 });
    };

    const client = new CultureSignApiClient(fetchMock as typeof fetch);
    const page = await client.fetchPage(
      {
        code: 'professional',
        name: '전문용어 수어',
        endpoint: 'http://api.kcisa.kr/openapi/service/rest/meta13/getCTE01702',
        splitTitles: true,
        cleanProfessionalTitle: true,
      },
      'test-key',
      1,
      10,
    );

    expect(attempts).toBe(3);
    expect(page.items[0]?.title).toBe('안녕하세요');
  });

  it('includes empty keyword query parameter in requests', async () => {
    const calls: string[] = [];
    const fetchMock = async (input: string | URL) => {
      calls.push(String(input));
      return new Response(SAMPLE_XML, { status: 200 });
    };

    const client = new CultureSignApiClient(fetchMock as typeof fetch);
    await client.fetchPage(
      {
        code: 'culture',
        name: '문화정보 수어',
        endpoint: 'http://api.kcisa.kr/openapi/service/rest/meta13/getCTE01703',
        splitTitles: false,
        cleanProfessionalTitle: false,
      },
      'test-key',
      1,
      10,
    );

    expect(calls[0]).toContain('keyword=');
  });

  it('throws for API error codes', () => {
    const client = new CultureSignApiClient();
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <header>
    <resultCode>0301</resultCode>
    <resultMsg>Invalid API Key</resultMsg>
  </header>
  <body />
</response>`;

    expect(() => client.parseResponse(errorXml, 1, 100)).toThrow(/Invalid API Key/);
  });
});
