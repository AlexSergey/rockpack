import React from 'react';
import { hydrate } from 'react-dom';
import createSsr from '@issr/core';
import { loadableReady } from '@loadable/component';
import App from './App';

const [SSR] = createSsr(window.SSR_DATA);

loadableReady(() => {
  hydrate(
    <SSR>
      <App />
    </SSR>,
    document.getElementById('root'),
  );
});
