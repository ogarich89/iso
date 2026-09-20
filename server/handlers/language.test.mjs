import { language } from './language.mjs';

describe('language', () => {
  it('should store the language in the session and answer with the payload', async () => {
    const set = vi.fn();

    await expect(language({ body: { lng: 'ru' }, session: { set } })).resolves.toEqual({
      message: 'Language is changed',
    });
    expect(set).toHaveBeenCalledWith('lng', 'ru');
  });
});
