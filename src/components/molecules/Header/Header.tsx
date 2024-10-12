import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Link } from 'src/components/molecules/Link/Link';
import { TOGGLE_MODAL, emitter } from 'src/libs/emitter';
import { session } from 'src/libs/session';

import style from './Header.scss';

import type { FunctionComponent } from 'react';

export const Header: FunctionComponent = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    await session.set('language', { lng });
  };

  return (
    <header>
      <div className={cx('container', style.container)}>
        <div className={style.wrapper}>
          <div className={style.logoContainer}>
            <Link to="/">
              ISO<small>JS</small>
            </Link>
          </div>
          <ul className={style.changeLanguage}>
            <li>
              <span onClick={() => changeLanguage('ru')}>ru</span>
            </li>
            <li>
              <span onClick={() => changeLanguage('en')}>en</span>
            </li>
          </ul>
        </div>
        <nav>
          <ul>
            <li>
              <Link
                to="/products"
                className={({ isActive }) =>
                  isActive ? style.active : undefined
                }
              >
                {t('products')}
              </Link>
            </li>
            <li>
              <span
                onClick={() =>
                  emitter.emit(TOGGLE_MODAL, { name: 'About', isShow: true })
                }
              >
                {t('about')}
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
