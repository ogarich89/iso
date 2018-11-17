import React, { Component } from 'react';
import style from './Warnings.scss';
import emitter from '../../../emitter';
import { TOGGLE_MODAL } from '../../../emitter/constants';

class Warnings extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const { data: { message, isWarning = true, isReload = false } } = this.props;
    return (
      <div className={style.warnings}>
        {
          isWarning ?
            <div className={style.titleContainer}>
              <h2>Warning</h2>
            </div> : undefined
        }
        <div className={style.textContainer}>
          <p>{ message }</p>
        </div>
        <div className={style.btnContainer}>
          {
            !isReload ?
              <button className="additional-button" onClick={() => emitter.emit(TOGGLE_MODAL, { isShow: false })}>Закрыть</button> :
              <button className="additional-button" onClick={() => location.reload()}>Перезагрузить страницу</button>
          }
        </div>
      </div>
    );
  }
}

export default Warnings;
