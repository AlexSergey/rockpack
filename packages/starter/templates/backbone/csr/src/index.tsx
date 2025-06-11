import { createHead, UnheadProvider } from '@unhead/react/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './types/global.declaration';
import { App } from './app';

const container = document.getElementById('root');

const root = createRoot(container as HTMLElement);

const head = createHead();

root.render(
  <StrictMode>
    <UnheadProvider head={head}>
      <App />
    </UnheadProvider>
  </StrictMode>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
