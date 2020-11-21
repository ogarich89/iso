import type { MouseEvent , FunctionComponent } from 'react';
import style from './Modal.scss';
import cx from 'classnames';

import emitter from '../../../emitter';
import { TOGGLE_MODAL } from 'shared/emitter/constants';
import { SVG } from 'shared/helpers';

import { About } from 'shared/components/_common/Modals/About/About';

const modals = {
  About
};

export type ModalName = keyof typeof modals;

export interface ModalProps {
  name?: ModalName;
  data?: Record<string, any>;
  isNotClose: boolean;
}

const Modal: FunctionComponent<ModalProps> = ({ name, data, isNotClose }) => {

  const closeModal = ({ target, currentTarget }: MouseEvent<HTMLDivElement>) => {
    if(target === currentTarget) {
      emitter.emit(TOGGLE_MODAL, { isShow: false });
    }
  }
  const TagName = name ? modals[name] : null;

  return (
    <div className={style.substrate}>
      <div className={style.wrapper} onClick={!isNotClose ? closeModal : undefined}>
        <div className={cx(style.modal)}>
          <button className={style.closeBtn} onClick={() => emitter.emit(TOGGLE_MODAL, { isShow: false })}>
            <span className="icon" dangerouslySetInnerHTML={{ __html: SVG.close }}/>
          </button>
          { TagName ? <TagName { ...{ data } }/> : null }
        </div>
      </div>
    </div>
  );
}

export default Modal;
