import React from 'react';
import { Switch, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import './styles.css';

const Home = loadable(() => import('./Home'));
const Secondary = loadable(() => import('./Secondary'));

export const App = (): JSX.Element => (
  <Switch>
    <Route path="/secondary" component={Secondary} />
    <Route path="/" component={Home} exact />
  </Switch>
);
