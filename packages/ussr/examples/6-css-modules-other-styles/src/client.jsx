import React from 'react';
import { hydrate } from 'react-dom';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { App } from './App';
import createUssr from '../../../src';

const [, Ussr] = createUssr(window.USSR_DATA);

const insertCss = (...styles) => {
  const removeCss = process.env.NODE_ENV === 'production' ?
    () => {} :
    styles.map(style => style._insertCss());
  return () => removeCss.forEach(dispose => dispose());
};

hydrate(
  <StyleContext.Provider value={{ insertCss }}>
    <Ussr>
      <Router history={createBrowserHistory()}>
        <App />
      </Router>
    </Ussr>
  </StyleContext.Provider>,
  document.getElementById('root')
);
