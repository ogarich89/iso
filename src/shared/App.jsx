import './App.scss';
import React, { Component, StrictMode } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import routes from './routes';
import { setOverflow } from '../client/helpers/set-overflow';

import emitter from './emitter';
import { TOGGLE_MODAL } from './emitter/constants';
import Header from './layouts/Header/Header';
import loadable from '@loadable/component';

const Modal = loadable(() =>
  import(/* webpackPrefetch: true, webpackChunkName: "modals" */ './components/_common/Modals/Modal')
);

@withRouter
class App extends Component {

  constructor(props) {
    super(props);
    const { location: { pathname } } = props;
    this.state = {
      pathname
    };
  }

  componentDidMount () {
    emitter.addListener(TOGGLE_MODAL, ::this.toggleModal);
    const { history } = this.props;
    history.listen(({ pathname }) => {
      const { pathname: prevPathname } = this.state;
      if(prevPathname !== pathname) {
        window.scrollTo(0,0);
        this.setState({ pathname });
      }
    });
  }

  toggleModal({ name, isShow, data, isNotClose }) {
    this.setState({ modal: { name, isShow, data, isNotClose } });
    setOverflow(isShow);
  }

  render() {
    const { modal = {} } = this.state;
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
        { Modal && modal.isShow ? <Modal { ...{ name: modal.name, data: modal.data, isNotClose: modal.isNotClose } }/> : null }
      </StrictMode>
    );
  }
}

export default App;

