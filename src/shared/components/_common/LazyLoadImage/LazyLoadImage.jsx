import React, { Component } from 'react';
import style from './LazyLoadImage.scss';

class LazyLoadImage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.lazyImageObserver.observe(this.img);
  }

  render() {
    const { placeholder, src, alt } = this.props;
    return (
      <img className={style.lazy} ref={img => this.img = img} src={placeholder} data-src={src} alt={alt}/>
    );
  }

}

export default LazyLoadImage;