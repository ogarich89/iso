import cx from 'classnames';
import { About } from 'src/components/molecules/Modals/About/About';
import CloseIcon from 'src/images/icons/close.svg';
import { TOGGLE_MODAL, emitter } from 'src/libs/emitter';

import style from './Modal.scss';

import type { MouseEvent, FunctionComponent } from 'react';

const modals = {
  About,
};

export type ModalName = keyof typeof modals;

export interface ModalProps {
  name?: ModalName;
  data?: Record<string, any>;
  isNotClose: boolean;
}

const Modal: FunctionComponent<ModalProps> = ({ name, data, isNotClose }) => {
  const closeModal = ({
    target,
    currentTarget,
  }: MouseEvent<HTMLDivElement>) => {
    if (target === currentTarget) {
      emitter.emit(TOGGLE_MODAL, { isShow: false });
    }
  };
  const TagName = name ? modals[name] : null;

  return (
    <div className={style.substrate}>
      <div
        className={style.wrapper}
        onClick={!isNotClose ? closeModal : undefined}
      >
        <div className={cx(style.modal)}>
          <button
            className={style.closeBtn}
            onClick={() => emitter.emit(TOGGLE_MODAL, { isShow: false })}
          >
            <CloseIcon className="icon" />
          </button>
          {TagName ? <TagName {...{ data }} /> : null}
        </div>
      </div>
    </div>
  );
};

export default Modal;
