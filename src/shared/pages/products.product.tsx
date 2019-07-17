import React, { Component } from 'react';
import Product from '../components/product/Product';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import api from '../../client/api';
import Loading from '../components/_common/Loading/Loading';
import PageNotFound from '../components/_common/PageNotFound/PageNotFound';
import { receivedProduct } from '../store/actions/products';
import { Store } from 'shared/store';


type MapStateToProps = {
  products: Array<{ id: number }> | undefined,
  product: object | undefined
}

type Props = {
  location: {
    pathname: string
  },
  dispatch: Dispatch,
  initialAction: Function
} & MapStateToProps

class productsProduct extends Component<Props> {

  componentDidMount() {
    const { location: { pathname }, dispatch, initialAction, products = [], product } = this.props;
    const [,,id] = pathname.split('/');
    if(!product) {
      const found = products.find(product => +product.id === +id);
      if(!found) {
        dispatch(initialAction(api, { originalUrl: pathname }));
      } else {
        dispatch(receivedProduct(found));
      }
    }
  }

  componentWillUnmount () {
    this.props.dispatch(receivedProduct(undefined));
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

export default connect(
  ({ products: { product, products } }: Store): MapStateToProps => ({ product, products })
)(productsProduct);
