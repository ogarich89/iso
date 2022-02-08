import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import options from '../../i18n.js';
import Backend from 'i18next-node-remote-backend';

i18next.use(Backend.default)
i18next.use(initReactI18next);
i18next.init(options);

export default i18next;
