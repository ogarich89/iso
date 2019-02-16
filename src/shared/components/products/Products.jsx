import React, { Component } from 'react';
import style from './Products.scss';
import cx from 'classnames';

import Card from '../_common/Card/Card';

class Products extends Component {
  render () {
    const { products } = this.props;
    return (
      <section className={style.products}>
        <div className={cx('container', style.container)}>
          <h1>Products</h1>
          <div className={style.productsContainer}>
            {
              products.map(product => <Card key={`product-${product.id}`} { ...product }/>)
            }
          </div>
        </div>
      </section>
    );
  }
}

export default Products;
