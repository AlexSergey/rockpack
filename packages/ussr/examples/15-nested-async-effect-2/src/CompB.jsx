import React from 'react';
import { useUssrState, useUssrEffect } from '../../../src';

const asyncFn3 = () => new Promise((resolve) => setTimeout(() => resolve('B Component'), 1000));

const B = () => {
  const [state, setState] = useUssrState('none');

  useUssrEffect(async () => {
    const data = await asyncFn3();
    setState(data);
  });
  return <div>
    <p>{state}</p>
  </div>;
}

export default B;
