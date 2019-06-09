// @flow
import React, { Component } from 'react';
import style from './LazyLoadImage.scss';

type LazyLoadImageProps = {
  placeholder: string,
  src: string,
  alt: string
}

class LazyLoadImage extends Component<LazyLoadImageProps> {
  img: ?HTMLImageElement;
  constructor(props: LazyLoadImageProps) {
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
