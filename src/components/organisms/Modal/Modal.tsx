import cx from 'classnames';
import { X } from 'lucide-react';
import type { FunctionComponent, MouseEvent } from 'react';
import { About } from 'src/components/organisms/Modal/About/About';
import { useModalStore } from 'src/store/ui';
import style from './Modal.module.scss';

const modals = {
  About,
};

export type ModalName = keyof typeof modals;

interface ModalProps {
  name?: ModalName;
  data?: Record<string, any>;
  isNotClose: boolean;
}

const Modal: FunctionComponent<ModalProps> = ({ name, data, isNotClose }) => {
  const close = useModalStore((state) => state.close);
  const closeModal = ({ target, currentTarget }: MouseEvent<HTMLDivElement>) => {
    if (target === currentTarget) {
      close();
    }
  };
  const TagName = name ? modals[name] : null;

  return (
    <div className={style.substrate}>
      <div className={style.wrapper} onClick={!isNotClose ? closeModal : undefined}>
        <div className={cx(style.modal)}>
          <button type="button" className={style.closeBtn} onClick={() => close()}>
            <X className="icon" />
          </button>
          {TagName ? <TagName {...{ data }} /> : null}
        </div>
      </div>
    </div>
  );
};

export default Modal;
