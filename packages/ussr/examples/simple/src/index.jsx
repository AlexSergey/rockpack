/* eslint-disable */
import React from 'react';
import { render } from 'react-dom';
import createUssr, { useUssrEffect } from '../../../dist';

const effect = () => new Promise((resolve) => setTimeout(() => resolve({ test: 'data'}), 1000));

const App = ({ children }) => {
  const [state, setState, runEffect] = useUssrEffect('appState.test', { test: 'i am test '});
  
  runEffect(() => effect().then(data => setState(data)));
  
  return (
    <div>
      <h1>{state.test}</h1>
      {typeof children === 'function' ? children(setState) : children}
    </div>
  );
};

(async () => {
  // @ts-ignore
  const [runEffects, Ussr] = createUssr({});
  
  // @ts-ignore
  render(<Ussr>
    <App>
      {setState => <button onClick={() => setState({ test: 'data 2' })}>Click</button>}
    </App></Ussr>, document.getElementById('root'));
  
  // @ts-ignore
  const state = await runEffects();
  const [, Ussr2] = createUssr(state);
  // @ts-ignore
  // @ts-ignore
  render(<Ussr2><App /></Ussr2>, document.getElementById('root2'));
})();
