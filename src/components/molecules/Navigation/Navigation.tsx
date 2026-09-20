import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'src/components/molecules/Link/Link';
import { useModalStore } from 'src/store/ui';
import style from './Navigation.module.scss';

export const Navigation: FunctionComponent = () => {
  const { t } = useTranslation();
  const open = useModalStore((state) => state.open);
  return (
    <nav className={style.navigation}>
      <ul>
        <li>
          <Link to="/products" className={({ isActive }) => (isActive ? style.active : undefined)}>
            {t('products')}
          </Link>
        </li>
        <li>
          <button type="button" onClick={() => open({ name: 'About' })}>
            {t('about')}
          </button>
        </li>
      </ul>
    </nav>
  );
};
