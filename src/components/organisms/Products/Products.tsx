import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Card } from 'src/components/molecules/Card/Card';

import style from './Products.scss';

import type { FunctionComponent } from 'react';
import type { Products } from 'src/types';

export const ProductsComponent: FunctionComponent<{ products: Products }> = ({
  products,
}) => {
  const { t } = useTranslation();
  return (
    <section className={style.products}>
      <div className={cx('container')}>
        <h1>{t('products')}</h1>
        <div className={style.productsContainer}>
          {products.map((product) => (
            <Card key={`product-${product.id}`} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};
