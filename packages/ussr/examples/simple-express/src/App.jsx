import React from 'react';
import { useUssrEffect } from '../../../src';

const effect = () => {
  console.log('run effect');
  return new Promise((resolve) => setTimeout(() => resolve({ test: 'data' }), 1000));
};

export const App = () => {
  const [state, setState, runEffect] = useUssrEffect('appState.test', { test: 'i am test ' });
  
  runEffect(() => effect()
    .then(data => setState(data)));
  
  return (
    <div>
      <h1>{state.test}</h1>
    </div>
  );
};
