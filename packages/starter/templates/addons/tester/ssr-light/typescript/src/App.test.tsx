import React from 'react';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { render } from '@testing-library/react';
import App from './App';

test('Render React App', () => {
  const { getByText } = render(
    <StyleContext.Provider value={{ insertCss: (): () => void => (): void => {} }}>
      <App />
    </StyleContext.Provider>,
  );
  const element = getByText(/Rockpack/i);

  expect(element)
    .toBeInTheDocument();
});
