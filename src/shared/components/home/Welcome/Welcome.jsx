// @flow
import React, { Component } from 'react';
import style from './Welcome.scss';
import { withTranslation, WithTranslation } from 'react-i18next';

@withTranslation()
class Welcome extends Component<WithTranslation> {
  constructor (props: WithTranslation) {
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
