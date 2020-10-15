import React from 'react';
import { useUssrState, useWillMount, useUssrEffect } from '../../../src';

const asyncFn = () => new Promise((resolve) => setTimeout(() => resolve('Hello world'), 1000));

export const App = () => {
  const effect = useUssrEffect('test');
  const [state, setState] = useUssrState('appState.text', 'text here');

  useWillMount(effect, () => asyncFn()
    .then(data => setState(data)));

  return (
    <div>
      <h1>{state}</h1>
    </div>
  );
};
