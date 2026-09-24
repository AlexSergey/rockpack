import { createRoot } from 'react-dom/client';

import './styles.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<h1 className="title">{process.env.APP_NAME}</h1>);
}
