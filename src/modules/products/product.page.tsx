import { Loading } from 'src/components/molecules/Loading/Loading';
import { useInitialState } from 'src/hooks/useInitialState';
import { PageNotFound } from 'src/modules/not-found/components/molecules/PageNotFound/PageNotFound';
import { ProductComponent } from 'src/modules/products/components/organisms/Product/Product';
import { resetProduct } from 'src/modules/products/store/products';

import type { PageComponent } from 'src/types';

const product: PageComponent = ({ initialAction }) => {
  const product = useInitialState(initialAction, (state) => state.product, resetProduct);

  return product === null ? (
    <PageNotFound />
  ) : product ? (
    <ProductComponent {...{ product }} />
  ) : (
    <Loading timeout={500} />
  );
};

export default product;
