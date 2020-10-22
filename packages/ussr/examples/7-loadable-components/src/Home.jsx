import React from 'react';
import { Link } from 'react-router-dom';
import { useUssrState, useUssrEffect } from '../../../src';
import { asyncFn } from './asyncFn';

const Home = () => {
  const [state, setState] = useUssrState('appState.text', 'i am test ');

  useUssrEffect(async () => {
    const data = await asyncFn();
    setState(data);
  });

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
