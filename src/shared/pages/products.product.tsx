import React, { Component, Dispatch } from 'react';
import { Product } from '../components/product/Product';
import { connect } from 'react-redux';
import { Loading } from '../components/_common/Loading/Loading';
import { PageNotFound } from '../components/_common/PageNotFound/PageNotFound';
import { receiveProduct } from '../store/actions/products';
import { IProduct, IStore } from '../../types';
import { InitialAction } from '../libs/page';

interface Props {
  dispatch: Dispatch<any>;
  initialAction: InitialAction;
  products: IProduct[];
  product: IProduct;
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
        product ? <Product { ...{ product } }/> : <Loading { ...{ timer: 500 }}/>
    );
  }
}

export default connect(({ products: { product, products } }: IStore) => ({ product, products }))(productsProduct);
