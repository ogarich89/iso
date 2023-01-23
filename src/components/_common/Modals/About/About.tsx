import { useTranslation } from 'react-i18next';

import style from './About.scss';

import type { FunctionComponent } from 'react';

export const About: FunctionComponent<{ data: any }> = () => {
  const { t } = useTranslation();
  return (
    <div className={style.about}>
      <div className={style.title}>
        <h4>{t('about_iso')}</h4>
      </div>
      <div className={style.textContainer}>
        <p>{t('description')}</p>
        <p>
          {t('developed_by')}
          <a href="https://github.com/ogarich89" target="_blank">
            ogarich89
          </a>
        </p>
      </div>
    </div>
  );
};
