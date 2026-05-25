import './global.scss';
import { createRoot } from 'react-dom/client';

import * as stylesLess from './styles.module.less';
import * as stylesScss from './styles.module.scss';

const container = document.getElementById('root');

const root = createRoot(container as HTMLElement);

root.render(
  <div className="myclass">
    <div className={stylesScss.block}>
      <h1>Test</h1>
      <button className={stylesLess.submit}>I am button</button>
    </div>
  </div>,
);
