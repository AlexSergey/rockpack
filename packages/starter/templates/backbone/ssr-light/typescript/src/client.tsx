import './types/global';
import React from 'react';
import { hydrate } from 'react-dom';
import createUssr from '@rockpack/ussr';
import { loadableReady } from '@loadable/component';
import App from './App';

declare global {
  interface Window {
    USSR_DATA: {
      [key: string]: unknown;
    };
  }
}

const [Ussr] = createUssr(window.USSR_DATA);

loadableReady(() => {
  hydrate(
    <Ussr>
      <App />
    </Ussr>,
    document.getElementById('root'),
  );
});
