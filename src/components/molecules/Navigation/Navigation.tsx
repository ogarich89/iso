import { useTranslation } from 'react-i18next';
import { Link } from 'src/components/molecules/Link/Link';
import { emitter, TOGGLE_MODAL } from 'src/libs/emitter';

import style from './Navigation.scss';

import type { FunctionComponent } from 'react';

export const Navigation: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <nav className={style.navigation}>
      <ul>
        <li>
          <Link
            to="/products"
            className={({ isActive }) => (isActive ? style.active : undefined)}
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
  );
};
