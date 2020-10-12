import React from 'react';
import { useUssrState, useWillMount, useUssrEffect } from '../../../src';

const asyncFn = () => new Promise((resolve, reject) => setTimeout(() => reject(new Error('SSR error!')), 1000));

export const App = () => {
  const [state, setState] = useUssrState('appState.text', { text: 'i am test ' });
  const effect = useUssrEffect('hello_world');
  useWillMount(effect, () => asyncFn()
    .then(data => setState(data)));

  return (
    <div>
      <h1>{state.text}</h1>
    </div>
  );
};
