import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import { ProductsComponent } from '../components/products/Products';
import { Loading } from '../components/_common/Loading/Loading';
import { PageNotFound } from '../components/_common/PageNotFound/PageNotFound';
import type { InitialAction, Products } from '../../types';
import { productsSelector } from '../recoil/selectors/products';
import { useRecoilState } from 'recoil';

interface Props {
  initialAction: InitialAction<Products>;
}

const products: FunctionComponent<Props> = ({ initialAction }) => {
  const [products, setProducts] = useRecoilState(productsSelector);
  useEffect(() => {
    if(!products?.length) {
      (async () => {
        const [ [, data ] ] = await initialAction();
        setProducts(data)
      })()
    }
  }, []);
  return (
    products === null ?
      <PageNotFound/> :
      products ? <ProductsComponent products={products} /> : <Loading timeout={500}/>
  );
}

export default products;
