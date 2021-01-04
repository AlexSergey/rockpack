import './types/global';
import React from 'react';
import { hydrate } from 'react-dom';
import createSsr from '@issr/core';
import { loadableReady } from '@loadable/component';
import App from './App';

declare global {
  interface Window {
    SSR_DATA: {
      [key: string]: unknown;
    };
  }
}

const [SSR] = createSsr(window.SSR_DATA);

loadableReady(() => {
  hydrate(
    <SSR>
      <App />
    </SSR>,
    document.getElementById('root'),
  );
});
