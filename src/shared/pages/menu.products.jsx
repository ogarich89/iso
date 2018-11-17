import React, { Component } from 'react';
import Products from '../components/Products/Products';
import { connect } from 'react-redux';
import api from '../../client/api';
import Loading from '../components/Loading/Loading';
import { withRouter } from 'react-router-dom';
import PageNotFound from '../components/PageNotFound/PageNotFound';

@withRouter
@connect(({ products: { products } }) => ({ products }))
class menuProducts extends Component {

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

export default menuProducts;
