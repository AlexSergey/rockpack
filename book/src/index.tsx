import { createHead, UnheadProvider } from '@unhead/react/client';
import { createRoot } from 'react-dom/client';

import { App } from './app';
import './types/global.declaration';
import './assets/styles/global.scss';

const container = document.getElementById('root');

const root = createRoot(container as HTMLElement);

const head = createHead();

root.render(
  <UnheadProvider head={head}>
    <App />
  </UnheadProvider>,
);
