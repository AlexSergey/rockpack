import React from 'react';
import StyleContext from 'isomorphic-style-loader/StyleContext';

export const StyleProvider = (storyFn) => (
  <StyleContext.Provider value={{ insertCss: () => {} }}>
    {storyFn()}
  </StyleContext.Provider>
)
