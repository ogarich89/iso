import React, { Component } from 'react';
import style from './PageNotFound.scss';

export default class PageNotFound extends Component {
  render () {
    return (
      <section className={style.pageNotFound}>
        <strong>PAGE NOT FOUND</strong>
      </section>
    );
  }

}
