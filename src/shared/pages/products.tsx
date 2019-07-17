import React, { Component } from 'react';
import Products from '../components/products/Products';
import { connect } from 'react-redux';
import api from '../../client/api';
import Loading from '../components/_common/Loading/Loading';
import PageNotFound from '../components/_common/PageNotFound/PageNotFound';
import { Store } from 'shared/store';
import { Dispatch } from 'redux';

type MapStateToProps = {
  products: Array<{ id: number }> | undefined,
}

type Props = {
  dispatch: Dispatch,
  initialAction: Function
} & MapStateToProps

class products extends Component<Props> {

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

export default connect(({ products: { products } }: Store): MapStateToProps => ({ products }))(products);
