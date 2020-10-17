import React, { Component, Dispatch } from 'react';
import { Products } from '../components/products/Products';
import { connect } from 'react-redux';
import { Loading } from '../components/_common/Loading/Loading';
import { PageNotFound } from '../components/_common/PageNotFound/PageNotFound';
import { IProduct, IStore } from '../../types';
import { InitialAction } from '../libs/page';

interface Props {
  products: IProduct[];
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
        products ? <Products { ...{ products } }/> : <Loading { ...{ timer: 500 }}/>
    );
  }
}

export default connect(({ products: { products } }: IStore) => ({ products }))(products);
