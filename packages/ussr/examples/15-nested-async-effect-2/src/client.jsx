import React from 'react';
import { hydrate } from 'react-dom';
import { App } from './App';
import createUssr from '../../../src';

const [Ussr] = createUssr(window.USSR_DATA);

hydrate(
  <Ussr>
    <App />
  </Ussr>,
  document.getElementById('root')
);
