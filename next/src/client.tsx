import React from 'react';
import { hydrate } from 'react-dom';
import createUssr from '@rock/ussr';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { App } from './App';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    USSR_DATA: any;
  }
}

const [, Ussr] = createUssr(window.USSR_DATA);

const insertCss = (...styles): () => void => {
  const removeCss = process.env.NODE_ENV === 'production' ?
    [] :
    styles.map(style => style._insertCss());
  return (): void => removeCss.forEach(dispose => dispose());
};

hydrate(
  <Ussr>
    <StyleContext.Provider value={{ insertCss }}>
      <Router history={createBrowserHistory()}>
        <App />
      </Router>
    </StyleContext.Provider>
  </Ussr>,
  document.getElementById('root')
);
