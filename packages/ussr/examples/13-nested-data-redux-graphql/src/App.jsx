import React from 'react';
import { useUssrState, useWillMount } from '../../../src';
import { Apollo } from './Apollo';

const effect = () => new Promise((resolve) => setTimeout(() => resolve({ text: 'Hello world', apollo: true }), 1000));

export const App = () => {
  const [state, setState] = useUssrState('appState.text', { text: 'i am test ', apollo: false });

  useWillMount(() => effect()
    .then(data => setState(data)));

  return (
    <div>
      <h1>{state.text}</h1>
      {state.apollo && <Apollo />}
    </div>
  );
};
