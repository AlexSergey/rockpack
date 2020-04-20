import React, { useEffect } from 'react';
import CustomScroll from 'react-customscroll';
import { useUssrState, useWillMount, isClient } from '../../../src';
import './styles.css';

const effect = () => {
  console.log('Prop');
  return new Promise((resolve) => setTimeout(() => resolve({ test: [1, 2, 3] }), 1000));
};

export const App = () => {
  const [state, setState] = useUssrState('appState.test', { test: [] });
  
  useWillMount(() => (
    effect()
      .then(data => {
        console.log(data);
        setState(data);
      })
  ));
  
  useEffect(() => {
    if (isClient()) {
      document.getElementById('block-3')
        .scrollIntoView();
    }
  }, []);
  
  return (
    <CustomScroll>
      <div>
        <h1>Items</h1>
        {state.test.map((item) => {
          
          
          console.log('render items');
          return (
            <div id={`block-${item}`} style={{ height: '1000px' }} key={`block-${item}`}>
              <h2>{item}</h2>
            </div>
          );
        })}
      </div>
    </CustomScroll>
  );
}
