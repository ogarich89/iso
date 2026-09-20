import { screen } from '@testing-library/react';
import axios from 'axios';
import { render } from 'src/app/server';

vi.mock('axios', () => ({ default: vi.fn() }));

vi.mock('i18next-http-backend', () => ({
  default: class Backend {
    static type = 'backend';
    type = 'backend';
    init() {}
    read(_lng: string, _ns: string, callback: (error: null, resources: Record<string, string>) => void) {
      callback(null, {});
    }
  },
}));

const product = { id: 1, color: '#98b2d1', pantone_value: '15-4020', year: 2000, name: 'cerulean' };

describe('client entry', () => {
  it('should hydrate the server rendered markup', async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: [product] } });
    window.history.pushState({}, '', '/products');
    const { appHtml } = await render('/products');
    document.body.innerHTML = `<div id="root">${appHtml}</div>`;
    window.__initialData__ = { products: [product] };
    window.initialLanguage = 'en';
    window.initialI18nStore = { en: { translation: {} } };

    await import('src/app/client');

    expect(await screen.findByText('cerulean')).toBeTruthy();
    expect(screen.getByRole('banner')).toBeTruthy();
  });
});
