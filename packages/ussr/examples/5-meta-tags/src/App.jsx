import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import { useUssrState, useWillMount } from '../../../src';

const effect = () => new Promise((resolve) => setTimeout(() => resolve({ text: 'Hello world' }), 1000));

const Home = () => {
  const [state, setState] = useUssrState('appState.text', { text: 'i am test ' });

  useWillMount(() => effect()
    .then(data => setState(data)));

  return (
    <>
      <MetaTags>
        <title>Home</title>
        <meta name="description" content="Home page" />
      </MetaTags>
      <div>
        <h1>{state.text}</h1>
        <Link to="/secondary">secondary</Link>
      </div>
    </>
  );
};

const Secondary = () => (
  <>
    <MetaTags>
      <title>Secondary</title>
      <meta name="description" content="Secondary page" />
    </MetaTags>
    <div>
      <h1>Secondary</h1>
      <Link to="/">Home</Link>
    </div>
  </>
);

export const App = () => (
  <Switch>
    <Route path="/secondary" component={Secondary} />
    <Route path="/" component={Home} exact />
  </Switch>
);
