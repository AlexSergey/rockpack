import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import useStyles from 'isomorphic-style-loader/useStyles';
import { useUssrState, useUssrEffect } from '../../../src';
import styles from './styles.module.scss';
import './styles.css';

const asyncFn = () => new Promise((resolve) => setTimeout(() => resolve('Hello world'), 1000));

const Home = () => {
  useStyles(styles);
  const [state, setState] = useUssrState('appState.text', 'i am test ');

  useUssrEffect(async () => {
    const data = await asyncFn();
    setState(data);
  });

  return (
    <>
      <MetaTags>
        <title>Home</title>
        <meta name="description" content="Home page" />
      </MetaTags>
      <div className={styles.block}>
        <h1>{state}</h1>
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
