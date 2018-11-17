import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Product extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { product: { name, year, id } } = this.props;
    return (
      <section>
        <Link to="/menu/products">PRODUCTS</Link>
        <div>PRODUCT!!!</div>
        <div>{name} {year} {id}</div>
      </section>
    );
  }
}

export default Product;
