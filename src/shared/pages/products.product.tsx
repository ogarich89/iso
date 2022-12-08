import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { ProductComponent } from '../components/product/Product';
import { Loading } from '../components/_common/Loading/Loading';
import { PageNotFound } from '../components/_common/PageNotFound/PageNotFound';
import type { InitialAction, Product } from '../../types';
import { useLocation, useParams } from 'react-router-dom';
import { productSelector } from '../recoil/selectors/products';
import { useRecoilState, useResetRecoilState } from 'recoil';

interface Props {
  initialAction: InitialAction<Product>;
}

const productsProduct: FunctionComponent<Props> = ({ initialAction }) => {
  const { pathname } = useLocation();
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useRecoilState(productSelector(id));
  const resetProduct = useResetRecoilState(productSelector(id));
  useEffect(() => {
    if(!product) {
      (async () => {
        const [ [, data] ] = await initialAction({ originalUrl: pathname });
        setProduct(data)
      })()
    }
    return () => {
      resetProduct()
    }
  }, [pathname]);
  return (
    product === null ?
      <PageNotFound/> :
      product ? <ProductComponent { ...{ product } }/> : <Loading timeout={500}/>
  )
}

export default productsProduct;
