import './global.scss';
import React from 'react';
import { render } from 'react-dom';
import stylesScss from './styles.module.scss';
import stylesLess from './styles.module.less';

render((
  <div className="myclass">
    <div className={stylesScss.block}>
      <h1>Test</h1>
      <button className={stylesLess.submit}>I am button</button>
    </div>
  </div>
), document.getElementById('root'));
