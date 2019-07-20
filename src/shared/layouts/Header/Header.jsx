// @flow
import React, { PureComponent } from 'react';
import style from './Header.scss';
import { NavLink, Link } from 'react-router-dom';
import emitter from '../../emitter';
import { TOGGLE_MODAL } from '../../emitter/constants';
import cx from 'classnames';
import { withTranslation, WithTranslation } from 'react-i18next';

@withTranslation()
class Header extends PureComponent<WithTranslation> {

  render () {
    const { i18n } = this.props;
    return (
      <header>
        <div className={cx('container', style.container)}>
          <div className={style.wrapper}>
            <div className={style.logoContainer}>
              <Link to="/">ISO<small>JS</small></Link>
            </div>
            <ul className={style.changeLanguage}>
              <li>
                <span onClick={() => i18n.changeLanguage('ru')}>ru</span>
              </li>
              <li>
                <span onClick={() => i18n.changeLanguage('en')}>en</span>
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

}

export default Header;
