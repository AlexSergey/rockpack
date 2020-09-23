import React from 'react';
import { hydrate } from 'react-dom';
import createUssr from '@rockpack/ussr';
import { loadableReady } from '@loadable/component';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import App from './App';

const [, Ussr] = createUssr(window.USSR_DATA);

const insertCss = (...styles) => {
  const removeCss = process.env.NODE_ENV === 'production'
    ? []
    // eslint-disable-next-line no-underscore-dangle
    : styles.map((style) => style && typeof style._insertCss === 'function' && style._insertCss());
  return () => removeCss.forEach((dispose) => dispose());
};

loadableReady(() => {
  hydrate(
    <Ussr>
      <StyleContext.Provider value={{ insertCss }}>
        <App />
      </StyleContext.Provider>
    </Ussr>,
    document.getElementById('root'),
  );
});
