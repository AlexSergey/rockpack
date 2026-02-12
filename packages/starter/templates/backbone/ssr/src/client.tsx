import { createSsr, IInitState } from '@issr/core';
import { createHead, UnheadProvider } from '@unhead/react/client';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import './types/global.declaration';
import { App } from './app';

declare global {
  interface Window {
    SSR_DATA: IInitState;
  }
}

const SSR = createSsr(window.SSR_DATA);

const head = createHead();

hydrateRoot(
  document.getElementById('root') as Element,
  <StrictMode>
    <SSR>
      <UnheadProvider head={head}>
        <App />
      </UnheadProvider>
    </SSR>
  </StrictMode>,
);
