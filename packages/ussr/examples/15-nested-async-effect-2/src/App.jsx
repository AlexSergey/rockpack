import React from 'react';
import { useUssrState, useUssrEffect } from '../../../src';

const asyncFn1 = () => new Promise((resolve) => setTimeout(() => resolve({ value: 'Wrapper Component', show: true }), 1000));
const asyncFn2 = () => new Promise((resolve) => setTimeout(() => resolve({ value: 'A Component', show: true }), 1000));
const asyncFn3 = () => new Promise((resolve) => setTimeout(() => resolve('B Component'), 1000));
const asyncFn4 = () => new Promise((resolve) => setTimeout(() => resolve('C Component'), 1000));

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

export const App = () => (
  <Wrapper>
    <A>
      <B />
    </A>
    <C />
  </Wrapper>
);
