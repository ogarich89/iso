import React, { Component } from 'react';
import style from './Product.scss';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import Card from '../_common/Card/Card';

class Products extends Component {
  render () {
    const { product } = this.props;
    return (
      <section className={style.product}>
        <div className={cx('container', style.container)}>
          <h1>{product.name}</h1>
          <Card { ...product }/>
          <Link className={style.link} to="/products">← Back</Link>
        </div>
      </section>
    );
  }
}

export default Products;
