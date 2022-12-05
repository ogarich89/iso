import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-node-remote-backend';

i18next.use(Backend.default)
i18next.use(initReactI18next);

export default i18next;
