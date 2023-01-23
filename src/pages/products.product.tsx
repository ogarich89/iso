import { useParams } from 'react-router-dom';
import { Loading } from 'src/components/_common/Loading/Loading';
import { PageNotFound } from 'src/components/_common/PageNotFound/PageNotFound';
import { ProductComponent } from 'src/components/product/Product';
import { useInitialState } from 'src/hooks/useInitialState';
import { productSelector } from 'src/recoil/selectors/products';

import type { Product, PageComponent } from 'src/types';

const productsProduct: PageComponent<Product | null> = ({ initialAction }) => {
  const { id } = useParams() as { id: string };

  const product = useInitialState(initialAction, productSelector(id), true);

  return product === null ? (
    <PageNotFound />
  ) : product ? (
    <ProductComponent {...{ product }} />
  ) : (
    <Loading timeout={500} />
  );
};

export default productsProduct;
