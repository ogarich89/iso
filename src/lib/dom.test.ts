import { setOverflow } from 'src/lib/dom';

const content = () => document.querySelector('main');

const scrollTo = (scrollY: number) => Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true });

describe('setOverflow', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    document.body.innerHTML = '<main></main>';
    sessionStorage.clear();
    scrollTo(0);
  });

  it('should hide overflow and remember scroll position', () => {
    scrollTo(120);
    setOverflow(true);
    expect(document.documentElement.className).toContain('hidden');
    expect(sessionStorage.getItem('scroll')).toBe('120');
    expect(content()?.getAttribute('style')).toBe('transform: translateY(-120px);');
  });

  it('should not shift content when page is not scrolled', () => {
    setOverflow(true);
    expect(document.documentElement.className).toContain('hidden');
    expect(content()?.getAttribute('style')).toBe(null);
  });

  it('should ignore repeated calls with the same state', () => {
    scrollTo(120);
    setOverflow(true);
    scrollTo(300);
    setOverflow(true);
    expect(sessionStorage.getItem('scroll')).toBe('120');
  });

  it('should restore overflow and scroll position', () => {
    scrollTo(120);
    setOverflow(true);
    setOverflow(false);
    expect(document.documentElement.className).not.toContain('hidden');
    expect(content()?.getAttribute('style')).toBe(null);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 120);
  });

  it('should do nothing when overflow is already restored', () => {
    setOverflow(false);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('should keep working when session storage is unavailable', () => {
    const error = new Error('denied');
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw error;
    });
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    setOverflow(true);
    expect(consoleError).toHaveBeenCalledWith(error);
    expect(document.documentElement.className).toContain('hidden');
    setItem.mockRestore();
    consoleError.mockRestore();
  });
});
