import React, { Component } from 'react';
import style from './Modal.scss';
import cx from 'classnames';

import emitter from '../../emitter';
import { TOGGLE_MODAL } from '../../emitter/constants';
import Warnings from './Warnings/Warnings';

const SVG = {
  close: require('../../../../public/images/icons/close.svg')
};

export default class Modal extends Component {

  modals = {
    Warnings
  };

  static closeModal({ target, currentTarget }) {
    if(target === currentTarget) {
      emitter.emit(TOGGLE_MODAL, { isShow: false });
    }
  }

  constructor (props) {
    super(props);
    const { name } = props;
    const TagName = this.modals[name];
    this.state = {
      TagName,
      isModal: !!TagName
    };
  }

  render () {
    const { data } = this.props;
    const { isModal, TagName } = this.state;
    return (
      <div className={style.substrate}>
        <div className={style.wrapper} onClick={Modal.closeModal}>
          <div className={cx(style.modal)}>
            <button className={style.closeBtn} onClick={() => emitter.emit(TOGGLE_MODAL, { isShow: false })}><span className="icon" dangerouslySetInnerHTML={{ __html: SVG.close }}/></button>
            { isModal ? <TagName { ...{ data } }/> : null }
          </div>
        </div>
      </div>
    );
  }

}
