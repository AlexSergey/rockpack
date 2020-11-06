import React from 'react';
import { useUssrState, useUssrEffect } from '../../../src';

const asyncFn4 = () => new Promise((resolve) => setTimeout(() => resolve('C Component'), 1000));

const C = () => {
  const [state, setState] = useUssrState('none');

  useUssrEffect(async () => {
    const data = await asyncFn4();
    setState(data);
  });
  return <div>
    <p>{state}</p>
  </div>;
}

export default C;
