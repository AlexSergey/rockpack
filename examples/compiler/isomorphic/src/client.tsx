import React from 'react';
import { hydrateRoot } from 'react-dom/client';

import { App } from './app';

hydrateRoot(document.getElementById('root') as HTMLElement, <App />);
