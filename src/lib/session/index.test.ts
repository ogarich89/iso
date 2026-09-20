import axios from 'axios';
import { session } from 'src/lib/session';

vi.mock('axios', () => ({ default: { get: vi.fn(), post: vi.fn() } }));

const settings = { headers: { 'x-requested-with': 'XMLHttpRequest' } };

describe('session', () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockReset();
    vi.mocked(axios.post).mockReset();
  });

  it('should read a session value', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: { lng: 'ru' } });

    await expect(session.get('language')).resolves.toEqual({ lng: 'ru' });
    expect(axios.get).toHaveBeenCalledWith('/session/language', settings);
  });

  it('should write a session value', async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: { lng: 'en' } });

    await expect(session.set('language', { lng: 'en' })).resolves.toEqual({ lng: 'en' });
    expect(axios.post).toHaveBeenCalledWith('/session/language', { lng: 'en' }, settings);
  });
});
