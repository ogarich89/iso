import React, { Component } from 'react';
import style from './Welcome.scss';

class Welcome extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <section className={style.welcome}>
        <h1>Welcome to the ISO starter-pack</h1>
      </section>
    );
  }

}

export default Welcome;
