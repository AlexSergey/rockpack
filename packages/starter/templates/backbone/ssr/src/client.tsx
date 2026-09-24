import type { IInitState } from '@issr/core';

import { createSsr } from '@issr/core';
import { createHead, UnheadProvider } from '@unhead/react/client';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import './types/global.declarations';
import { App } from './app';

declare global {
  // Global augmentation merges with the built-in Window, which only works with an interface.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
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
      <UnheadProvider value={head}>
        <App />
      </UnheadProvider>
    </SSR>
  </StrictMode>,
);
