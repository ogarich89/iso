import { Loading } from 'src/components/molecules/Loading/Loading';
import { useInitialState } from 'src/hooks/useInitialState';
import { PageNotFound } from 'src/modules/not-found/components/molecules/PageNotFound/PageNotFound';
import { ProductsComponent } from 'src/modules/products/components/organisms/Products/Products';

import type { PageComponent } from 'src/types';

const products: PageComponent = ({ initialAction }) => {
  const products = useInitialState(initialAction, (state) => state.products);
  return products === null ? (
    <PageNotFound />
  ) : products ? (
    <ProductsComponent products={products} />
  ) : (
    <Loading timeout={500} />
  );
};

export default products;
