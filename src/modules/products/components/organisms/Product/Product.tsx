import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { Link } from 'src/components/molecules/Link/Link';
import { Card } from 'src/modules/products/components/molecules/Card/Card';
import type { Product } from 'src/modules/products/types';
import style from './Product.module.scss';

export const ProductComponent: FunctionComponent<{ product: Product }> = ({ product }) => (
  <section className={style.product}>
    <div className={cx('container')}>
      <h1>{product.name}</h1>
      <Card {...product} />
      <Link className={style.link} to="/products">
        ← Back
      </Link>
    </div>
  </section>
);
