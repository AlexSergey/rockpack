import { createRoot } from 'react-dom/client';

import { ColorString } from './color.component';

createRoot(document.getElementById('root') as HTMLElement).render(
  <div>
    <ColorString color="red" />
  </div>,
);
