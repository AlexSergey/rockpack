import './global.scss';
import React from 'react';
import { createRoot } from 'react-dom/client';

import stylesLess from './styles.module.less';
import stylesScss from './styles.module.scss';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <div className="myclass">
    <div className={stylesScss['block']}>
      <h1>Test</h1>
      <button className={stylesLess['submit']}>I am button</button>
    </div>
  </div>,
);
