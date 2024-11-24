import './global.scss';
import { createRoot } from 'react-dom/client';
import * as stylesScss from './styles.module.scss';
import * as stylesLess from './styles.module.less';

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
