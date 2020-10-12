import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import useStyles from 'isomorphic-style-loader/useStyles';
import { useUssrState, useWillMount, useUssrEffect } from '../../../src';
import styles from './styles.modules.scss';
import './styles.css';

const asyncFn = () => new Promise((resolve) => setTimeout(() => resolve({ text: 'Hello world' }), 1000));

const Home = () => {
  useStyles(styles);
  const [state, setState] = useUssrState('appState.text', { text: 'i am test ' });
  const effect = useUssrEffect('hello_world');
  useWillMount(effect, () => asyncFn()
    .then(data => setState(data)));

  return (
    <>
      <MetaTags>
        <title>Home</title>
        <meta name="description" content="Home page" />
      </MetaTags>
      <div className={styles.block}>
        <h1>{state.text}</h1>
        <Link to="/secondary">secondary</Link>
      </div>
    </>
  );
};

const Secondary = () => {
  useStyles(styles);
  return (
    <>
      <MetaTags>
        <title>Secondary</title>
        <meta name="description" content="Secondary page" />
      </MetaTags>
      <div className={styles.block}>
        <h1>Secondary</h1>
        <Link to="/">Home</Link>
      </div>
    </>
  );
};

export const App = () => (
  <Switch>
    <Route path="/secondary" component={Secondary} />
    <Route path="/" component={Home} exact />
  </Switch>
);
