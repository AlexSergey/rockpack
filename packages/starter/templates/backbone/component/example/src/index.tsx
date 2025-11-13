import { createRoot } from 'react-dom/client';

import RockpackComponent from '../../src';

const container = document.getElementById('root');

const root = createRoot(container as HTMLElement);

root.render(<RockpackComponent />);
