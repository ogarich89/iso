import { Loading } from 'src/components/_common/Loading/Loading';
import { PageNotFound } from 'src/components/_common/PageNotFound/PageNotFound';
import { ProductsComponent } from 'src/components/products/Products';
import { useInitialState } from 'src/hooks/useInitialState';
import { productsSelector } from 'src/recoil/selectors/products';

import type { Products, PageComponent, State } from 'src/types';

const products: PageComponent<[State<Products>]> = ({ initialAction }) => {
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
