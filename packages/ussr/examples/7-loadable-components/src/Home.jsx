import React from 'react';
import { Link } from 'react-router-dom';
import { useUssrState, useWillMount, useUssrEffect } from '../../../src';
import { asyncFn } from './asyncFn';

const Home = () => {
  const [state, setState] = useUssrState('appState.text', 'i am test ');
  const effect = useUssrEffect('hello_world');
  useWillMount(effect, () => asyncFn()
    .then(data => setState(data)));

  return (
    <>
      <div>
        <h1>{state}</h1>
        <Link to="/secondary">secondary</Link>
      </div>
    </>
  );
};

export default Home;
