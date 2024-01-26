import { Loading } from 'src/components/molecules/Loading/Loading';
import { PageNotFound } from 'src/components/molecules/PageNotFound/PageNotFound';
import { ProductsComponent } from 'src/components/organisms/Products/Products';
import { useInitialState } from 'src/hooks/useInitialState';

import type { PageComponent, Store } from 'src/types';

const products: PageComponent = ({ initialAction }) => {
  const products = useInitialState(
    initialAction,
    ({ products }: Store) => products.products
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
