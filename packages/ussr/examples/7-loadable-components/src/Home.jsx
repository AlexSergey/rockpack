import React from 'react';
import { Link } from 'react-router-dom';
import { useUssrState, useWillMount } from '../../../src';
import { effect } from './effect';

const Home = () => {
  const [state, setState] = useUssrState('appState.text', { text: 'i am test ' });

  useWillMount(() => effect()
    .then(data => setState(data)));

  return (
    <>
      <div>
        <h1>{state.text}</h1>
        <Link to="/secondary">secondary</Link>
      </div>
    </>
  );
};

export default Home;
