import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { ProductComponent } from '../components/product/Product';
import { useDispatch, useSelector } from 'react-redux';
import { Loading } from '../components/_common/Loading/Loading';
import { PageNotFound } from '../components/_common/PageNotFound/PageNotFound';
import { receiveProduct } from '../store/actions/goods';
import type { Store } from '../../types';
import type { InitialAction } from '../libs/page';
import { useLocation, useParams } from 'react-router-dom';

interface Props {
  initialAction: InitialAction;
}

const productsProduct: FunctionComponent<Props> = ({ initialAction }) => {
  const { pathname } = useLocation();
  const { id } = useParams() as { id: string };
  const { products, product } = useSelector(({ goods }: Store) => goods);
  const dispatch = useDispatch();
  useEffect(() => {
    if(!product) {
      const found = products.find(product => +product.id === +id);
      if(!found) {
        dispatch(initialAction({ originalUrl: pathname }));
      } else {
        dispatch(receiveProduct(found));
      }
    }
    return () => {
      dispatch(receiveProduct(undefined))
    }
  }, [pathname]);
  return (
    product === null ?
      <PageNotFound/> :
      product ? <ProductComponent { ...{ product } }/> : <Loading timeout={500}/>
  )
}

export default productsProduct;
