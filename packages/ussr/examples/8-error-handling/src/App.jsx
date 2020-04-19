import React from 'react';
import { useUssrEffect } from '../../../src';

const effect = () => {
  return new Promise((resolve, reject) => setTimeout(() => reject(new Error('SSR error!')), 1000));
};

export const App = () => {
  const [state, setState, willMount] = useUssrEffect('appState.test', { test: 'i am test ' });
  
  willMount(() => effect()
    .then(data => setState(data)));
  
  return (
    <div>
      <h1>{state.test}</h1>
    </div>
  );
};
