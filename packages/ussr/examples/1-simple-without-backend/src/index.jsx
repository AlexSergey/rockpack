/* eslint-disable */
import React from 'react';
import { render } from 'react-dom';
import createUssr, { useUssrState, useWillMount } from '../../../src';

const effect = () => new Promise((resolve) => setTimeout(() => resolve({ text: 'Hello world'}), 1000));

const App = ({ children }) => {
  const [state, setState] = useUssrState('appState.text', { text: 'text here'});

  useWillMount(() => effect()
    .then(data => setState(data)));

  return (
    <div>
      <h1>{state.text}</h1>
      {typeof children === 'function' ? children(setState) : children}
    </div>
  );
};

(async () => {
  const [runEffects, Ussr] = createUssr({}, { onlyClient: true });

  render(<Ussr>
    <App>
      {setState => <button onClick={() => setState({ text: 'Hello world 2' })}>Click</button>}
    </App></Ussr>, document.getElementById('root'));

  const state = await runEffects();
  const [, Ussr2] = createUssr(state, { onlyClient: true });

  render(<Ussr2><App /></Ussr2>, document.getElementById('root2'));
})();
