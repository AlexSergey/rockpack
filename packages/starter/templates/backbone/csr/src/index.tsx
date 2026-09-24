import { createHead, UnheadProvider } from '@unhead/react/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './types/global.declarations';
import { App } from './app';

const container = document.getElementById('root');

const root = createRoot(container as HTMLElement);

const head = createHead();

root.render(
  <StrictMode>
    <UnheadProvider value={head}>
      <App />
    </UnheadProvider>
  </StrictMode>,
);

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- undefined outside HMR builds, typed as always set
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
