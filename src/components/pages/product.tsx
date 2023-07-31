import { useParams } from 'react-router-dom';
import { Loading } from 'src/components/molecules/Loading/Loading';
import { PageNotFound } from 'src/components/molecules/PageNotFound/PageNotFound';
import { ProductComponent } from 'src/components/organisms/Product/Product';
import { useInitialState } from 'src/hooks/useInitialState';
import { productSelector } from 'src/recoil/selectors/products';

import type { Product, PageComponent, State } from 'src/types';

const product: PageComponent<[State<Product>]> = ({ initialAction }) => {
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

export default product;
