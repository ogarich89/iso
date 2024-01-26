import { Loading } from 'src/components/molecules/Loading/Loading';
import { PageNotFound } from 'src/components/molecules/PageNotFound/PageNotFound';
import { ProductComponent } from 'src/components/organisms/Product/Product';
import { useInitialState } from 'src/hooks/useInitialState';
import { receiveProduct } from 'src/store/actions/products';

import type { PageComponent, Store } from 'src/types';

const product: PageComponent = ({ initialAction }) => {
  const product = useInitialState(
    initialAction,
    ({ products }: Store) => products.product,
    receiveProduct,
  );

  return product === null ? (
    <PageNotFound />
  ) : product ? (
    <ProductComponent {...{ product }} />
  ) : (
    <Loading timeout={500} />
  );
};

export default product;
