import React, { Component } from 'react';
import style from './Header.scss';
import { NavLink, Link } from 'react-router-dom';
import emitter from '../../emitter';
import { TOGGLE_MODAL } from '../../emitter/constants';
import cx from 'classnames';

class Header extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <header className={style.header}>
        <div className={cx('container', style.container)}>
          <div className={style.logoContainer}>
            <Link to="/">ISO<small>JS</small></Link>
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
