import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useUssrEffect } from '../../../src';

const effect = () => {
  return new Promise((resolve) => setTimeout(() => resolve({ test: 'data' }), 1000));
};

const Home = () => {
  const [state, setState, willMount] = useUssrEffect('appState.test', { test: 'i am test ' });
  
  willMount(() => effect()
    .then(data => setState(data)));
  
  return (
    <div>
      <h1>{state.test}</h1>
      <Link to="/secondary">secondary</Link>
    </div>
  );
};

const Secondary = () => (
  <div>
    <h1>Secondary</h1>
    <Link to="/">Home</Link>
  </div>
);

export const App = () => (
  <Switch>
    <Route path="/secondary" component={Secondary} />
    <Route path="/" component={Home} exact />
  </Switch>
);
