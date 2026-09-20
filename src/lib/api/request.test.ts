import axios from 'axios';
import { request, serverTarget } from 'src/lib/api/request';
import { z } from 'zod';

vi.mock('axios', () => ({ default: vi.fn() }));

const schema = z.array(z.object({ id: z.number(), name: z.string() }));

describe('serverTarget', () => {
  afterEach(() => {
    globalThis.__API__ = undefined;
    globalThis.__API_KEY__ = undefined;
  });

  it('should fall back to the values compiled into the bundle', () => {
    expect(serverTarget()).toEqual({ base: 'https://reqres.in', apiKey: 'test-api-key' });
  });

  it('should prefer what the server set at boot, so an image needs no rebuild', () => {
    globalThis.__API__ = 'https://api.example.com';
    globalThis.__API_KEY__ = 'runtime-key';

    expect(serverTarget()).toEqual({ base: 'https://api.example.com', apiKey: 'runtime-key' });
  });
});

describe('request', () => {
  beforeEach(() => {
    vi.mocked(axios).mockReset();
  });

  it('should call the proxy path without the api key from the browser', async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: [{ id: 1, name: 'cerulean' }] } });

    const response = await request('products', schema, { page: 2 });

    expect(axios).toHaveBeenCalledWith('/api/products/', { method: 'GET', params: { page: 2 } });
    expect(response).toEqual([{ id: 1, name: 'cerulean' }]);
  });

  it('should forward the cookie header of the incoming request', async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: [] } });

    await request(
      'product',
      schema,
      { id: '3' },
      { id: '3' },
      { url: '/products/3', headers: { cookie: 'session=1' } },
    );

    expect(axios).toHaveBeenCalledWith('/api/product/', {
      method: 'GET',
      params: { id: '3' },
      headers: { cookie: 'session=1' },
    });
  });

  it('should drop fields the schema does not declare', async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: [{ id: 1, name: 'cerulean', support: 'ad' }] } });

    await expect(request('products', schema, {})).resolves.toEqual([{ id: 1, name: 'cerulean' }]);
  });

  it('should reject a response that does not match the schema', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(axios).mockResolvedValue({ data: { data: [{ id: 'one' }] } });

    await expect(request('products', schema, {})).rejects.toThrow('Invalid response for "products"');
    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('products'));

    consoleError.mockRestore();
  });

  it('should propagate request failures', async () => {
    vi.mocked(axios).mockRejectedValue(new Error('network'));

    await expect(request('products', schema, {})).rejects.toThrow('network');
  });
});
