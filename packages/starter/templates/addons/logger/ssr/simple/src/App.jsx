import React from 'react';
import { useUssrState, useWillMount } from '@rockpack/ussr';
import { LoggerContainer } from '@rockpack/logger';

const effect = () => new Promise((resolve) => setTimeout(() => resolve({ text: 'Hello world' }), 1000));

const App = () => {
  const [state, setState] = useUssrState('appState.text', { text: 'i am test' });

  useWillMount(() => effect()
    .then(data => setState(data)));

  return (
    <div>
      <h1>{state.text}</h1>
    </div>
  );
};

export default () => (
  <LoggerContainer>
    <App />
  </LoggerContainer>
);

