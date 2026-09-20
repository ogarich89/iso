import axios from 'axios';
import { request } from 'src/lib/api/request';
import { z } from 'zod';

vi.mock('axios', () => ({ default: vi.fn() }));

const schema = z.array(z.object({ id: z.number(), name: z.string() }));

describe('request', () => {
  beforeEach(() => {
    vi.mocked(axios).mockReset();
  });

  it('should send data as query params for GET methods', async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: [{ id: 1, name: 'cerulean' }] } });

    const response = await request('products', schema, { page: 2 });

    expect(axios).toHaveBeenCalledWith('https://reqres.in/api/products/', {
      method: 'GET',
      params: { page: 2 },
      headers: { 'x-api-key': 'test-api-key' },
    });
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

    expect(axios).toHaveBeenCalledWith('https://reqres.in/api/product/', {
      method: 'GET',
      params: { id: '3' },
      headers: { 'x-api-key': 'test-api-key', cookie: 'session=1' },
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
