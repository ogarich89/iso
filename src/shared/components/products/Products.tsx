import React, { FunctionComponent } from 'react';
import style from './Products.scss';
import cx from 'classnames';

import { Card } from '../_common/Card/Card';
import { IProduct } from '../../../types';

export const Products: FunctionComponent<{ products: IProduct[] }> = ({ products }) => (
  <section className={style.products}>
    <div className={cx('container')}>
      <h1>Products</h1>
      <div className={style.productsContainer}>
        {
          products.map(product => <Card key={`product-${product.id}`} { ...product }/>)
        }
      </div>
    </div>
  </section>
)
