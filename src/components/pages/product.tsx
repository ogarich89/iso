import { Loading } from 'src/components/molecules/Loading/Loading';
import { PageNotFound } from 'src/components/molecules/PageNotFound/PageNotFound';
import { ProductComponent } from 'src/components/organisms/Product/Product';
import { useInitialState } from 'src/hooks/useInitialState';
import { productsSlice } from 'src/store/reducers/productsSlice';

const { resetProduct } = productsSlice.actions;

import type { PageComponent } from 'src/types';

const product: PageComponent = ({ initialAction }) => {
  const product = useInitialState(
    initialAction,
    ({ productsReducer }) => productsReducer.product,
    resetProduct,
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
