import React, { Component } from 'react';
import style from './Welcome.scss';
import { translate } from 'react-i18next';

@translate()
class Welcome extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { t } = this.props;
    return (
      <section className={style.welcome}>
        <h1>{t('hello')}</h1>
      </section>
    );
  }

}

export default Welcome;
