import { useQuery } from '@tanstack/react-query';
import type { FunctionComponent } from 'react';
import { Loading } from 'src/components/molecules/Loading/Loading';
import { PageNotFound } from 'src/modules/not-found/components/molecules/PageNotFound/PageNotFound';
import { ProductsComponent } from 'src/modules/products/components/organisms/Products/Products';
import { productsQuery } from 'src/modules/products/queries';

const products: FunctionComponent = () => {
  const { data, isPending } = useQuery(productsQuery());

  return isPending ? <Loading timeout={500} /> : data ? <ProductsComponent products={data} /> : <PageNotFound />;
};

export default products;
