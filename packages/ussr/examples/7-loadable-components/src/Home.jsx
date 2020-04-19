import React from 'react';
import { Link } from 'react-router-dom';
import { useUssrEffect } from '../../../src';
import { effect } from './effect';

const Home = () => {
  const [state, setState, willMount] = useUssrEffect('appState.test', { test: 'i am test ' });
  
  willMount(() => effect()
    .then(data => setState(data)));
  
  return (
    <>
      <div>
        <h1>{state.test}</h1>
        <Link to="/secondary">secondary</Link>
      </div>
    </>
  );
};

export default Home;
