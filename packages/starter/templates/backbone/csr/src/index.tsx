import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './types/global.declaration';
import { App } from './app';

const container = document.getElementById('root');

const root = createRoot(container as HTMLElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
