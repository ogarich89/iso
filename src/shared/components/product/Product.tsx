import type { FunctionComponent } from 'react';
import style from './Product.scss';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { Card } from '../_common/Card/Card';
import type { Product } from '../../../types';

export const ProductComponent: FunctionComponent<{ product: Product }> = ({ product }) => (
  <section className={style.product}>
    <div className={cx('container')}>
      <h1>{product.name}</h1>
      <Card { ...product }/>
      <Link className={style.link} to="/products">← Back</Link>
    </div>
  </section>
)
