import type { FunctionComponent } from 'react';
import React from 'react';
import style from './Products.scss';
import cx from 'classnames';

import { Card } from '../_common/Card/Card';
import type { Products } from '../../../types';

export const ProductsComponent: FunctionComponent<{ products: Products }> = ({ products }) => (
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
