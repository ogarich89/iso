import './App.scss';
import type { ReactElement } from 'react';
import { StrictMode, useEffect, useState } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import routes from './routes';
import { setOverflow } from 'client/helpers/set-overflow';
import emitter from './emitter';
import { TOGGLE_MODAL } from './emitter/constants';
import type { DefaultComponent, LoadableComponent } from '@loadable/component';
import loadable from '@loadable/component';
import { Header } from 'shared/layouts/Header/Header';
import type { ModalName, ModalProps } from './components/_common/Modals/Modal';

const Modal: LoadableComponent<ModalProps> = loadable(
  (): Promise<DefaultComponent<ModalProps>> =>
    import(/* webpackPrefetch: true, webpackChunkName: "modals" */ './components/_common/Modals/Modal'),
  { ssr: false }
);

interface ModalSettings {
  name?: ModalName;
  isShow: boolean;
  data?: Record<string, any>;
  isNotClose: boolean;
}

export const App = () => {
  const history = useHistory();
  const { pathname } = useLocation();

  const [currentPathname, setPathname] = useState(pathname);
  const [modal, setModal] = useState<ModalSettings>({
    isShow: false,
    isNotClose: false
  });

  const toggleModal = ({ name, isShow = false, data, isNotClose = false }: ModalSettings): void => {
    setModal({ name, isShow, data, isNotClose });
    setOverflow(isShow);
  };

  useEffect(() => {
    emitter.addListener(TOGGLE_MODAL, toggleModal);
    history.listen(({ pathname }) => {
      if(currentPathname !== pathname) {
        window.scrollTo(0,0);
        setPathname(pathname);
      }
    });
  }, []);

  return (
    <StrictMode>
      <main>
        <Header/>
        <Switch>
          {routes.map(({ path, exact, component: Component, initialAction }, i) =>
            <Route key={i} {...{ path, exact } } render={(props): ReactElement<typeof props> =>
              <Component { ...{ initialAction, ...props }}/>} />
          )}
        </Switch>
      </main>
      { Modal && modal.isShow ?
        <Modal { ...{ name: modal.name, data: modal.data, isNotClose: modal.isNotClose } }/> : null }
    </StrictMode>
  )
};

