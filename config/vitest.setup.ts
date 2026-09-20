import { vi } from 'vitest';

vi.mock('react-i18next', () => {
  const t = (key: string) => key.split(':')[1] || key;
  return {
    useTranslation: () => ({ t, i18n: { language: 'en' } }),
    Trans: ({ children }: { children?: unknown }) => children ?? null,
    initReactI18next: { type: '3rdParty', init: () => undefined },
  };
});
