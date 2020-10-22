/* eslint-disable */
import React from 'react';
import { render } from 'react-dom';
import createUssr, { useUssrState, useUssrEffect } from '../../../src';

const asyncFn = () => new Promise((resolve) => setTimeout(() => resolve('Hello world'), 1000));

const App = ({ children }) => {
  const [state, setState] = useUssrState('appState.text', 'text here');

  useUssrEffect(async () => {
    const data = await asyncFn();
    setState(data);
  });

  return (
    <div>
      <h1>{state}</h1>
      {typeof children === 'function' ? children(setState) : children}
    </div>
  );
};

(async () => {
  const [Ussr, getState, effectCollection] = createUssr({}, { onlyClient: true });

  render(<Ussr>
    <App>
      {setState => <button onClick={() => setState('Hello world 2')}>Click</button>}
    </App></Ussr>, document.getElementById('root'));

  await effectCollection.runEffects();
  const [Ussr2] = createUssr(getState(), { onlyClient: true });

  render(<Ussr2><App /></Ussr2>, document.getElementById('root2'));
})();
