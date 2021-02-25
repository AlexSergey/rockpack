import './assets/styles/global.scss';
import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import Index from './routes/Index';

const Home = loadable(() => import('./routes/Home'));
const Image = loadable(() => import('./routes/Image'));

const App = (): JSX.Element => (
  <Index>
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/image" component={Image} />
      <Redirect to="/" />
    </Switch>
  </Index>
);

export default App;
