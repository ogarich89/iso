import { useQuery } from '@tanstack/react-query';
import type { FunctionComponent } from 'react';
import { useParams } from 'react-router';
import { Loading } from 'src/components/molecules/Loading/Loading';
import { PageNotFound } from 'src/modules/not-found/components/molecules/PageNotFound/PageNotFound';
import { ProductComponent } from 'src/modules/products/components/organisms/Product/Product';
import { productQuery } from 'src/modules/products/queries';

const product: FunctionComponent = () => {
  const { id } = useParams();
  const { data, isPending } = useQuery(productQuery(id ?? ''));

  return isPending ? <Loading timeout={500} /> : data ? <ProductComponent product={data} /> : <PageNotFound />;
};

export default product;
