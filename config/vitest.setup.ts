import { vi } from 'vitest';

vi.mock('react-i18next', () => {
  const t = (key: string) => key.split(':')[1] || key;
  const changeLanguage = vi.fn(async () => undefined);
  return {
    useTranslation: () => ({ t, i18n: { language: 'en', changeLanguage } }),
    Trans: ({ children }: { children?: unknown }) => children ?? null,
    I18nextProvider: ({ children }: { children?: unknown }) => children ?? null,
    initReactI18next: { type: '3rdParty', init: () => undefined },
  };
});

beforeEach(() => {
  vi.stubGlobal('scrollTo', vi.fn());
});

if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close() {
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
}
