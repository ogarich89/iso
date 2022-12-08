import options from 'i18n';
import i18next from 'i18next';
import Fetch from 'i18next-fetch-backend';
import { initReactI18next } from 'react-i18next';

import type { InitOptions } from 'i18next';

i18next.use(Fetch);
i18next.use(initReactI18next);
i18next.init(options() as InitOptions);
