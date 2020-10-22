import React from 'react';
import { useUssrState, useUssrEffect } from '../../../src';

const asyncFn = () => new Promise((resolve, reject) => setTimeout(() => reject(new Error('SSR error!')), 1000));

export const App = () => {
  const [state, setState] = useUssrState('appState.text', 'i am test ');

  useUssrEffect(async () => {
    const data = await asyncFn();
    setState(data);
  });

  return (
    <div>
      <h1>{state}</h1>
    </div>
  );
};
