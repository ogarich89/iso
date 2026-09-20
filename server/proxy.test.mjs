import { proxyHeaders } from './proxy.mjs';

describe('proxyHeaders', () => {
  it('should add the api key the browser does not have', () => {
    const headers = proxyHeaders('secret-key')({}, { accept: 'application/json' });

    expect(headers).toEqual({ accept: 'application/json', 'x-api-key': 'secret-key' });
  });

  it('should not send our session cookie to the backend', () => {
    const headers = proxyHeaders('secret-key')({}, { Cookie: 'session_id=abc', accept: '*/*' });

    expect(headers).toEqual({ accept: '*/*', 'x-api-key': 'secret-key' });
  });

  it('should pass the headers through when no key is configured', () => {
    const headers = proxyHeaders('')({}, { accept: '*/*' });

    expect(headers).toEqual({ accept: '*/*' });
  });
});
