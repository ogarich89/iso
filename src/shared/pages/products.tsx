import type { Dispatch } from 'react';
import React, { Component } from 'react';
import { ProductsComponent } from '../components/products/Products';
import { connect } from 'react-redux';
import { Loading } from '../components/_common/Loading/Loading';
import { PageNotFound } from '../components/_common/PageNotFound/PageNotFound';
import type { Products, Store } from '../../types';
import type { InitialAction } from '../libs/page';

interface Props {
  products: Products;
  dispatch: Dispatch<any>;
  initialAction: InitialAction;
}

class products extends Component<Props> {

  componentDidMount() {
    const { products, dispatch, initialAction } = this.props;
    if(!products || !products.length) {
      dispatch(initialAction());
    }
  }

  render() {
    const { products } = this.props;
    return (
      products === null ?
        <PageNotFound/> :
        products ? <ProductsComponent { ...{ products } }/> : <Loading { ...{ timer: 500 }}/>
    );
  }
}

export default connect(({ goods: { products } }: Store) => ({ products }))(products);
