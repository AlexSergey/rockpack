import React from 'react';
import { useUssrState, useWillMount } from '@rockpack/ussr';
import { LoggerContainer } from '@rockpack/logger';

type Data = { text: string };

const effect = (): Promise<Data> => new Promise((resolve) => setTimeout(() => resolve({ text: 'Hello world' }), 1000));

const App = () => {
  const [state, setState] = useUssrState<Data>('appState.text', { text: 'i am test' });

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
