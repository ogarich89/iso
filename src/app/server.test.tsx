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

describe('render', () => {
  beforeEach(() => {
    vi.mocked(axios).mockReset();
  });

  it('should render the matched page with the serialized store', async () => {
    const { appHtml, preloadLinks, state } = await render('/');

    expect(appHtml).toContain('hello');
    expect(preloadLinks).toBe('');
    expect(state).toContain('window.__QUERY_STATE__');
    expect(state).toContain('window.initialLanguage = "en"');
  });

  it('should prefetch the queries of the matched route', async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: [product] } });

    const { appHtml, state } = await render('/products?page=1', { lng: 'ru' });

    expect(axios).toHaveBeenCalledWith('/api/products/', { method: 'GET', params: {} });
    expect(appHtml).toContain('cerulean');
    expect(state).toContain('cerulean');
    expect(state).toContain('"products"');
    expect(state).toContain('window.initialLanguage = "ru"');
  });

  it('should prefetch with the params of the matched url', async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: product } });

    const { appHtml, state } = await render('/products/1');

    expect(axios).toHaveBeenCalledWith('/api/product/', expect.objectContaining({ params: { id: '1' } }));
    expect(appHtml).toContain('cerulean');
    expect(state).toContain('"product"');
  });

  it('should build preload links from the ssr manifest', async () => {
    vi.mocked(axios).mockResolvedValue({ data: { data: [product] } });

    const { preloadLinks } = await render('/products', {
      manifest: {
        '/src/layouts/main.tsx': ['assets/main.js', 'assets/main.css'],
        'src/modules/products/products.page.tsx': ['assets/products.js', 'assets/main.js', 'assets/readme.txt'],
      },
    });

    expect(preloadLinks).toBe(
      [
        '<link rel="modulepreload" crossorigin href="/assets/main.js">',
        '<link rel="stylesheet" href="/assets/main.css">',
        '<link rel="modulepreload" crossorigin href="/assets/products.js">',
      ].join(''),
    );
  });

  it('should mark the state scripts with the csp nonce', async () => {
    const { state } = await render('/', { nonce: 'r4nd0m' });

    expect(state.match(/<script nonce="r4nd0m">/g)).toHaveLength(2);
  });

  it('should leave the state scripts bare without a nonce', async () => {
    const { state } = await render('/');

    expect(state).toContain('<script>window.__QUERY_STATE__');
  });

  it('should render the not found page for an unmatched location', async () => {
    const { appHtml, preloadLinks } = await render('/unknown', { manifest: {} });

    expect(appHtml).toContain('PAGE NOT FOUND');
    expect(preloadLinks).toBe('');
  });
});
