import { Route, Routes } from 'react-router-dom';
import { renderNestedRoutes } from 'src/helpers';
import routes from 'src/routes';

import './App.scss';

import type { FunctionComponent } from 'react';

export const App: FunctionComponent = () => {
  return (
    <Routes>
      {routes.map(
        ({ path, component: Component, initialAction, children }, index) => (
          <Route
            key={index}
            path={path}
            element={<Component {...{ initialAction }} />}
          >
            {renderNestedRoutes(children)}
          </Route>
        )
      )}
    </Routes>
  );
};
