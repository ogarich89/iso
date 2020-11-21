import type { Dispatch } from 'react';
import { Component } from 'react';
import { ProductComponent } from '../components/product/Product';
import { connect } from 'react-redux';
import { Loading } from '../components/_common/Loading/Loading';
import { PageNotFound } from '../components/_common/PageNotFound/PageNotFound';
import { receiveProduct } from '../store/actions/goods';
import type { Product, Products, Store } from '../../types';
import type { InitialAction } from '../libs/page';

interface Props {
  dispatch: Dispatch<any>;
  initialAction: InitialAction;
  products: Products;
  product: Product;
  location: Location;
}

class productsProduct extends Component<Props> {

  componentDidMount() {
    const { location: { pathname }, dispatch, initialAction, products, product } = this.props;
    const [,,id] = pathname.split('/');
    if(!product) {
      const found = products.find(product => +product.id === +id);
      if(!found) {
        dispatch(initialAction({ originalUrl: pathname }));
      } else {
        dispatch(receiveProduct(found));
      }
    }
  }

  componentWillUnmount () {
    this.props.dispatch(receiveProduct(undefined));
  }

  render() {
    const { product } = this.props;
    return (
      product === null ?
        <PageNotFound/> :
        product ? <ProductComponent { ...{ product } }/> : <Loading { ...{ timer: 500 }}/>
    );
  }
}

export default connect(({ goods: { product, products } }: Store) => ({ product, products }))(productsProduct);
