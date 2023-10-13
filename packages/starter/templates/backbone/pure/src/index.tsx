import { createRoot } from 'react-dom/client';

import { App } from './app';
import './types/global.declaration';

const container = document.getElementById('root');

const root = createRoot(container as HTMLElement);

root.render(<App />);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
