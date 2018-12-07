import React, { Component } from 'react';
import Products from '../components/products/Products';
import { connect } from 'react-redux';
import api from '../../client/api';
import Loading from '../components/_common/Loading/Loading';
import { withRouter } from 'react-router-dom';
import PageNotFound from '../components/_common/PageNotFound/PageNotFound';

@withRouter
@connect(({ products: { products } }) => ({ products }))
class products extends Component {

  componentDidMount() {
    const { products, dispatch, initialAction } = this.props;
    if(!products || !products.length) {
      dispatch(initialAction(api));
    }
  }

  render() {
    const { products } = this.props;
    return (
      products === null ?
        <PageNotFound/> :
        products ? <Products { ...{ products } }/> : <Loading { ...{ timer: 500 }}/>
    );
  }
}

export default products;
