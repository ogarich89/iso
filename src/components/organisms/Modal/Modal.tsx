import { X } from 'lucide-react';
import type { FunctionComponent, MouseEvent, SyntheticEvent } from 'react';
import { useEffect, useRef } from 'react';
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
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  const closeOnBackdrop = ({ target, currentTarget }: MouseEvent<HTMLDialogElement>) => {
    if (target === currentTarget) {
      currentTarget.close();
    }
  };

  const preventClosing = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const TagName = name ? modals[name] : null;

  return (
    <dialog
      ref={dialog}
      className={style.substrate}
      onClose={close}
      onCancel={isNotClose ? preventClosing : undefined}
      onClick={isNotClose ? undefined : closeOnBackdrop}
    >
      <div className={style.modal}>
        <button type="button" className={style.closeBtn} onClick={() => dialog.current?.close()}>
          <X className="icon" />
        </button>
        {TagName ? <TagName {...{ data }} /> : null}
      </div>
    </dialog>
  );
};

export default Modal;
