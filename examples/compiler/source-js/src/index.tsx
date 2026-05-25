import { createRoot } from 'react-dom/client';

import './assets/styles/index.css';
import { App } from './component/app';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
