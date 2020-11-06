import React from 'react';
import { useUssrState, useUssrEffect } from '../../../src';

const asyncFn2 = () => new Promise((resolve) => setTimeout(() => resolve({ value: 'A Component', show: true }), 1000));

const A = ({ children }) => {
  const [state, setState] = useUssrState({ value: 'none ', show: false });

  useUssrEffect(async () => {
    const data = await asyncFn2();
    setState(data);
  });
  return <div>
    <p>{state.value}</p>
    {state.show && children}
  </div>;
}

export default A;
