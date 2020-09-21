import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('Render React App', () => {
  const { getByText } = render(<App />);
  const element = getByText(/Rockpack/i);

  expect(element)
    .toBeInTheDocument();
});
