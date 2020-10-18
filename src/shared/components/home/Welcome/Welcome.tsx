import type { FunctionComponent } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import style from './Welcome.scss';

export const Welcome: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <section className={style.welcome}>
      <h1>{t('hello')}</h1>
    </section>
  )
}
