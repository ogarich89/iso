import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { Loading } from 'shared/components/_common/Loading/Loading';
import { PageNotFound } from 'shared/components/_common/PageNotFound/PageNotFound';
import { ProductsComponent } from 'shared/components/products/Products';
import { productsSelector } from 'shared/recoil/selectors/products';

import type { FunctionComponent } from 'react';
import type { InitialAction, Products } from 'types';

interface Props {
  initialAction: InitialAction<Products>;
}

const products: FunctionComponent<Props> = ({ initialAction }) => {
  const [products, setProducts] = useRecoilState(productsSelector);
  useEffect(() => {
    if (!products?.length) {
      (async () => {
        const [[, data]] = await initialAction();
        setProducts(data);
      })();
    }
  }, []);
  return products === null ? (
    <PageNotFound />
  ) : products ? (
    <ProductsComponent products={products} />
  ) : (
    <Loading timeout={500} />
  );
};

export default products;
