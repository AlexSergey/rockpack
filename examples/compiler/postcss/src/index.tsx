import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <div>
    <h1>Test</h1>
  </div>,
);
