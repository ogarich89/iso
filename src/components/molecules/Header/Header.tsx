import cx from 'classnames';
import { Logo } from 'src/components/atoms/Logo/Logo';
import { LanguageSwitch } from 'src/components/molecules/LanguageSwitch/LanguageSwitch';
import { Navigation } from 'src/components/molecules/Navigation/Navigation';

import style from './Header.scss';

import type { FunctionComponent } from 'react';

export const Header: FunctionComponent = () => {
  return (
    <header>
      <div className={cx('container', style.container)}>
        <div className={style.wrapper}>
          <Logo />
          <Navigation />
        </div>
        <LanguageSwitch />
      </div>
    </header>
  );
};
