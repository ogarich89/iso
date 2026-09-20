import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import style from './About.module.scss';

export const About: FunctionComponent<{ data: any }> = () => {
  const { t } = useTranslation();
  return (
    <div className={style.about}>
      <div className={style.title}>
        <h2>{t('about_iso')}</h2>
      </div>
      <div className={style.textContainer}>
        <p>{t('description')}</p>
        <p>
          {t('developed_by')}
          <a href="https://github.com/ogarich89" target="_blank" rel="noopener">
            ogarich89
          </a>
        </p>
      </div>
    </div>
  );
};
