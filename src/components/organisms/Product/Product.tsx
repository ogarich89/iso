import cx from 'classnames';
import { Card } from 'src/components/molecules/Card/Card';
import { Link } from 'src/components/molecules/Link/Link';

import style from './Product.scss';

import type { FunctionComponent } from 'react';
import type { Product } from 'src/types';

export const ProductComponent: FunctionComponent<{ product: Product }> = ({
  product,
}) => (
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
