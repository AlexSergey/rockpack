import React from 'react';
import { hydrate } from 'react-dom';
import { CreateStoreProvider } from './Connect';
import { App } from './App';
import createUssr from '../../../src';

const [Ussr] = createUssr();

const { StoreProvider } = CreateStoreProvider(window.MOBX_DATA);

hydrate(
  <Ussr>
    <StoreProvider>
      <App />
    </StoreProvider>
  </Ussr>,
  document.getElementById('root')
);
