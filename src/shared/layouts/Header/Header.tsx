import React, { FunctionComponent } from 'react';
import style from './Header.scss';
import { NavLink, Link } from 'react-router-dom';
import emitter from '../../emitter';
import { TOGGLE_MODAL } from '../../emitter/constants';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { session } from '../../session';

export const Header: FunctionComponent = () => {
  const { i18n } = useTranslation();

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    await session.set('language', { lng });
  }

  return (
    <header>
      <div className={cx('container', style.container)}>
        <div className={style.wrapper}>
          <div className={style.logoContainer}>
            <Link to="/">ISO<small>JS</small></Link>
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
              <NavLink to="/products" activeClassName={style.active}>Products</NavLink>
            </li>
            <li>
              <span onClick={() => emitter.emit(TOGGLE_MODAL, { name: 'About', isShow: true })}>About</span>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
