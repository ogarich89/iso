import cx from 'classnames';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from 'src/modules/products/components/molecules/Card/Card';
import type { Products } from 'src/modules/products/types';
import style from './Products.module.scss';

export const ProductsComponent: FunctionComponent<{ products: Products }> = ({ products }) => {
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
