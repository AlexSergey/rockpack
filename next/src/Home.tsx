import React from 'react';
import { Link } from 'react-router-dom';
import { useUssrState, useWillMount } from '@rock/ussr';
import MetaTags from 'react-meta-tags';
import useStyles from 'isomorphic-style-loader/useStyles';
import { effect } from './effect';
import styles from './styles.modules.scss';

interface StateInterface {
  text: string;
}

const Home = (): JSX.Element => {
  useStyles(styles);
  const [state, setState] = useUssrState<StateInterface>('appState.text', { text: 'i am test ' });

  useWillMount(() => effect()
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

export default Home;
