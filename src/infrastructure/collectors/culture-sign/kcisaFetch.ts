const KCISA_HOST = 'api.kcisa.kr';
const DEFAULT_KCISA_IP = '175.125.91.8';

function isDnsError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const code = (error as NodeJS.ErrnoException).code;
  const causeCode = (error.cause as NodeJS.ErrnoException | undefined)?.code;
  return code === 'ENOTFOUND' || causeCode === 'ENOTFOUND';
}

function shouldUseIpFallback(response: Response): boolean {
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location') ?? '';
    return location.includes('www.kcisa.kr');
  }

  return false;
}

function buildIpFallbackUrl(url: URL, ipFallback: string): URL {
  const ipUrl = new URL(url.toString());
  ipUrl.protocol = 'http:';
  ipUrl.hostname = ipFallback;
  return ipUrl;
}

function toUrl(input: string | Request | URL): URL {
  if (input instanceof URL) {
    return input;
  }
  if (input instanceof Request) {
    return new URL(input.url);
  }
  return new URL(input);
}

export async function kcisaFetch(
  input: string | Request | URL,
  init?: RequestInit,
): Promise<Response> {
  const url = toUrl(input);
  const ipFallback = process.env.KCISA_API_IP_FALLBACK ?? DEFAULT_KCISA_IP;
  const requestInit: RequestInit = {
    ...init,
    redirect: 'manual',
  };

  try {
    const response = await fetch(url, requestInit);
    if (shouldUseIpFallback(response)) {
      return fetchViaIp(url, init, ipFallback);
    }
    return response;
  } catch (error) {
    if (isDnsError(error)) {
      return fetchViaIp(url, init, ipFallback);
    }
    throw error;
  }
}

async function fetchViaIp(
  url: URL,
  init: RequestInit | undefined,
  ipFallback: string,
): Promise<Response> {
  const ipUrl = buildIpFallbackUrl(url, ipFallback);
  const headers = new Headers(init?.headers);
  headers.set('Host', KCISA_HOST);

  return fetch(ipUrl, {
    ...init,
    headers,
    redirect: 'manual',
  });
}
