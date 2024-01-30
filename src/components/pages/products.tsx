import { Loading } from 'src/components/molecules/Loading/Loading';
import { PageNotFound } from 'src/components/molecules/PageNotFound/PageNotFound';
import { ProductsComponent } from 'src/components/organisms/Products/Products';
import { useInitialState } from 'src/hooks/useInitialState';

import type { PageComponent } from 'src/types';

const products: PageComponent = ({ initialAction }) => {
  const products = useInitialState(
    initialAction,
    ({ productsReducer }) => productsReducer.products,
  );
  return products === null ? (
    <PageNotFound />
  ) : products ? (
    <ProductsComponent products={products} />
  ) : (
    <Loading timeout={500} />
  );
};

export default products;
