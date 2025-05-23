import { createSsr } from '@issr/core';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import './types/global.declaration';
import { App } from './app';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SSR_DATA: any;
  }
}

const SSR = createSsr(window.SSR_DATA);

hydrateRoot(
  document.getElementById('root') as Element,
  <StrictMode>
    <SSR>
      <App />
    </SSR>
  </StrictMode>,
);
