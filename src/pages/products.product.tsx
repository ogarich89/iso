import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { Loading } from 'src/components/_common/Loading/Loading';
import { PageNotFound } from 'src/components/_common/PageNotFound/PageNotFound';
import { ProductComponent } from 'src/components/product/Product';
import { productSelector } from 'src/recoil/selectors/products';

import type { FunctionComponent } from 'react';
import type { InitialAction, Product } from 'src/types';

interface Props {
  initialAction: InitialAction<Product>;
}

const productsProduct: FunctionComponent<Props> = ({ initialAction }) => {
  const { pathname } = useLocation();
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useRecoilState(productSelector(id));
  const resetProduct = useResetRecoilState(productSelector(id));
  useEffect(() => {
    if (!product) {
      (async () => {
        const [[, data]] = await initialAction({ url: pathname });
        setProduct(data);
      })();
    }
    return () => {
      resetProduct();
    };
  }, [pathname]);
  return product === null ? (
    <PageNotFound />
  ) : product ? (
    <ProductComponent {...{ product }} />
  ) : (
    <Loading timeout={500} />
  );
};

export default productsProduct;
