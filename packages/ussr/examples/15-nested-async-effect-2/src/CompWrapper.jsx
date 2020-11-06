import React from 'react';
import { useUssrState, useUssrEffect } from '../../../src';

const asyncFn1 = () => new Promise((resolve) => setTimeout(() => resolve({
  value: 'Wrapper Component',
  show: true
}), 1000));

const Wrapper = ({ children }) => {
  const [state, setState] = useUssrState({ value: 'none ', show: false });

  useUssrEffect(async () => {
    const data = await asyncFn1();
    setState(data);
  });

  return <div>
    <p>{state.value}</p>
    {state.show && children}
  </div>;
}

export default Wrapper;
