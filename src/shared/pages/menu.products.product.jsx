import React, { Component } from 'react';
import Product from '../components/Product/Product';
import { connect } from 'react-redux';
import api from '../../client/api';
import Loading from '../components/Loading/Loading';
import PageNotFound from '../components/PageNotFound/PageNotFound';

@connect(({ products: { product } = { } }) => ({ product }))
class menuProductsProduct extends Component {

  componentDidMount() {
    const { location: { pathname }, dispatch, initialAction } = this.props;
    const { product } = this.props;
    if(!product) {
      dispatch(initialAction(api, { originalUrl: pathname }));
    }
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

export default menuProductsProduct;
