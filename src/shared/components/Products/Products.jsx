import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Products extends Component {
  render () {
    const { products } = this.props;
    return (
      <section>
        <Link to="/menu/products/1">PRODUCT</Link>
        <div>PRODUCTS!!!</div>
        {
          products.map(({ name, year, id }) => {
            return (
              <div key={`product-${id}`}>{name} {year}</div>
            );
          })
        }
      </section>
    );
  }
}

export default Products;
