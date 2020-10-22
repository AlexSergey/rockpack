import React from 'react';
import { useUssrState, useUssrEffect } from '../../../src';

const effect = () => new Promise((resolve) => setTimeout(() => resolve('Hello world'), 1000));

const asyncFn = async (resolve) => {
  const data = await effect();
  resolve(data);
}

const simpleFn = (resolve) => asyncFn(resolve);

export const App = () => {
  const [state, setState] = useUssrState('appState.text', 'text here');

  useUssrEffect(() => (
    new Promise(resolve => simpleFn(resolve, 1000))
      .then(setState)
  ));

  return (
    <div>
      <h1>{state}</h1>
    </div>
  );
};
