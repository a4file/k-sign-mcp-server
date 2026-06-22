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
