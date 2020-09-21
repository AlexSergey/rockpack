import React from 'react';
import { hydrate } from 'react-dom';
import createUssr from '@rockpack/ussr';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import App from './App';

declare global {
  interface Window {
    USSR_DATA: {
      [key: string]: unknown;
    };
  }
}

const [, Ussr] = createUssr(window.USSR_DATA);

const insertCss = (...styles): () => void => {
  const removeCss = process.env.NODE_ENV === 'production'
    ? []
    // eslint-disable-next-line no-underscore-dangle
    : styles.map((style) => style && typeof style._insertCss === 'function' && style._insertCss());
  return (): void => removeCss.forEach((dispose) => dispose());
};

hydrate(
  <Ussr>
    <StyleContext.Provider value={{ insertCss }}>
      <App />
    </StyleContext.Provider>
  </Ussr>,
  document.getElementById('root'),
);
