import './App.scss';
import React, { Component, StrictMode } from 'react';
import { Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import routes from './routes';
import { setOverflow } from '../client/helpers/set-overflow';

import emitter from './emitter';
import { TOGGLE_MODAL } from './emitter/constants';
import Header from './layouts/Header/Header';
import loadable from '@loadable/component';

const Modal = loadable(() =>
  import(/* webpackPrefetch: true, webpackChunkName: "modals" */ './components/_common/Modals/Modal')
);

type State = {
  modal?: Modal,
  pathname: string
}

type Modal = {
  name: string,
  isShow: boolean,
  data: object,
  isNotClose: boolean
}

class App extends Component<RouteComponentProps, State> {

  constructor(props: RouteComponentProps) {
    super(props);
    const { location: { pathname } } = props;
    this.state = {
      pathname
    };
  }

  componentDidMount () {
    emitter.addListener(TOGGLE_MODAL, this.toggleModal, false);
    const { history } = this.props;
    history.listen(({ pathname }) => {
      const { pathname: prevPathname } = this.state;
      if(prevPathname !== pathname) {
        window.scrollTo(0,0);
        this.setState({ pathname });
      }
    });
  }

  toggleModal = ({ name, isShow, data, isNotClose }: Modal): void => {
    this.setState({ modal: { name, isShow, data, isNotClose } });
    setOverflow(isShow);
  };

  render() {
    const { modal } = this.state;
    return (
      <StrictMode>
        <Header/>
        <main>
          <Switch>
            {routes.map(({ path, exact, component: Component, initialAction }, i) => {
              return <Route key={i} {...{ path, exact } } render={props => <Component { ...{ initialAction, ...props }}/>} />;
            })}
          </Switch>
        </main>
        { Modal && modal && modal.isShow ? <Modal { ...{ name: modal.name, data: modal.data, isNotClose: modal.isNotClose } }/> : null }
      </StrictMode>
    );
  }
}

export default withRouter(App);

