import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Loading } from 'src/components/_common/Loading/Loading';
import { PageNotFound } from 'src/components/_common/PageNotFound/PageNotFound';
import { ProductsComponent } from 'src/components/products/Products';
import { productsSelector } from 'src/recoil/selectors/products';

import type { FunctionComponent } from 'react';
import type { InitialAction, Products } from 'src/types';

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
