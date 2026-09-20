import { Routes } from 'react-router';
import routes from 'src/app/routes';
import { renderRoutes } from 'src/lib/route';

import 'reset-css/reset.css';
import './App.scss';

import type { FunctionComponent } from 'react';

export const App: FunctionComponent = () => {
  return <Routes>{renderRoutes(routes)}</Routes>;
};
