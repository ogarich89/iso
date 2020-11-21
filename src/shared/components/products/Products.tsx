import type { FunctionComponent } from 'react';
import style from './Products.scss';
import cx from 'classnames';

import { Card } from '../_common/Card/Card';
import type { Products } from '../../../types';
import { useTranslation } from 'react-i18next';

export const ProductsComponent: FunctionComponent<{ products: Products }> = ({ products }) => {
  const { t } = useTranslation();
  return (
    <section className={style.products}>
      <div className={cx('container')}>
        <h1>{t('products')}</h1>
        <div className={style.productsContainer}>
          {
            products.map(product => <Card key={`product-${product.id}`} { ...product }/>)
          }
        </div>
      </div>
    </section>
  )
}
