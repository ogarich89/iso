import { Loading } from 'src/components/_common/Loading/Loading';
import { PageNotFound } from 'src/components/_common/PageNotFound/PageNotFound';
import { ProductsComponent } from 'src/components/products/Products';
import { useInitialState } from 'src/hooks/useInitialState';
import { productsSelector } from 'src/recoil/selectors/products';

import type { Products, PageComponent } from 'src/types';

const products: PageComponent<Products | null> = ({ initialAction }) => {
  const products = useInitialState(initialAction, productsSelector);
  return products === null ? (
    <PageNotFound />
  ) : products ? (
    <ProductsComponent products={products} />
  ) : (
    <Loading timeout={500} />
  );
};

export default products;
