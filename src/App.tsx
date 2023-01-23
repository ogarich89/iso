import loadable from '@loadable/component';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import emitter from 'src/emitter';
import { TOGGLE_MODAL } from 'src/emitter/constants';
import { setOverflow } from 'src/helpers/set-overflow';
import { Header } from 'src/layouts/Header/Header';
import routes from 'src/routes';

import './App.scss';

import type { DefaultComponent, LoadableComponent } from '@loadable/component';
import type {
  ModalName,
  ModalProps,
} from 'src/components/_common/Modals/Modal';

const Modal: LoadableComponent<ModalProps> = loadable(
  (): Promise<DefaultComponent<ModalProps>> =>
    import(
      /* webpackChunkName: "modals" */ './components/_common/Modals/Modal'
    ),
  { ssr: false }
);

interface ModalSettings {
  name?: ModalName;
  isShow: boolean;
  data?: Record<string, any>;
  isNotClose: boolean;
}

export const App = () => {
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
        <Routes>
          {routes.map(
            ({ path, exact, component: Component, initialAction }, i) => (
              <Route
                key={i}
                {...{ path, exact }}
                element={<Component {...{ initialAction }} />}
              />
            )
          )}
        </Routes>
      </main>
      {Modal && modal.isShow ? (
        <Modal
          {...{
            name: modal.name,
            data: modal.data,
            isNotClose: modal.isNotClose,
          }}
        />
      ) : null}
    </>
  );
};
