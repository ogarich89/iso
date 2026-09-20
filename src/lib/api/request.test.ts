import axios from 'axios';
import { request } from 'src/lib/api/request';

vi.mock('axios', () => ({ default: vi.fn() }));

describe('request', () => {
  beforeEach(() => {
    vi.mocked(axios).mockReset();
  });

  it('should send data as query params for GET methods', async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: [{ id: 1 }] } });

    const response = await request('products', { page: 2 });

    expect(axios).toHaveBeenCalledWith('https://reqres.in/api/products/', {
      method: 'GET',
      params: { page: 2 },
      headers: { 'x-api-key': 'test-api-key' },
    });
    expect(response).toEqual({ data: [{ id: 1 }] });
  });

  it('should forward the cookie header of the incoming request', async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: { id: 3 } } });

    await request('product', { id: '3' }, { id: '3' }, { url: '/products/3', headers: { cookie: 'session=1' } });

    expect(axios).toHaveBeenCalledWith('https://reqres.in/api/product/', {
      method: 'GET',
      params: { id: '3' },
      headers: { 'x-api-key': 'test-api-key', cookie: 'session=1' },
    });
  });

  it('should propagate request failures', async () => {
    vi.mocked(axios).mockRejectedValue(new Error('network'));

    await expect(request('products', {})).rejects.toThrow('network');
  });
});
