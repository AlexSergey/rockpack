import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app';
import { Rest } from './rest';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <Rest options={{ baseURL: 'http://localhost:4000/' }}>
    <App />
  </Rest>,
);
