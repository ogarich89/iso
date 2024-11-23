import loadable from '@loadable/component';
import { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router';
import { Header } from 'src/components/molecules/Header/Header';
import { setOverflow } from 'src/helpers';
import { emitter, TOGGLE_MODAL } from 'src/libs/emitter';

import type { ModalName } from 'src/components/molecules/Modals/Modal';

const Modal = loadable(
  () =>
    import(
      /* webpackChunkName: "modals" */ 'src/components/molecules/Modals/Modal'
    ),
  { ssr: false },
);

interface ModalSettings {
  name?: ModalName;
  isShow: boolean;
  data?: Record<string, any>;
  isNotClose: boolean;
}

const Main = () => {
  const { pathname } = useLocation();

  const [currentPathname, setPathname] = useState(pathname);
  const [modal, setModal] = useState<ModalSettings>({
    isShow: false,
    isNotClose: false,
  });

  const toggleModal = ({
    name,
    isShow = false,
    data,
    isNotClose = false,
  }: ModalSettings): void => {
    setModal({ name, isShow, data, isNotClose });
    setOverflow(isShow);
  };

  useEffect(() => {
    emitter.addListener(TOGGLE_MODAL, toggleModal);
    if (currentPathname !== pathname) {
      window.scrollTo(0, 0);
      setPathname(pathname);
    }
  }, [pathname]);

  return (
    <>
      <main>
        <Header />
        <Outlet />
      </main>
      {Modal && modal.isShow ? <Modal {...modal} /> : null}
    </>
  );
};

export default Main;
