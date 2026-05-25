import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

import { App } from './app';
import { MockRest, Rest } from './rest';

const renderApp = () =>
  render(
    <Rest options={{ baseURL: 'http://localhost:4000/' }}>
      <MockRest
        mock={(mocker) => {
          mocker.onPost('/getData').reply(() => [200, { id: 1, name: 'John Smith' }]);
        }}
      >
        <App />
      </MockRest>
    </Rest>,
  );

describe('Test rest api', () => {
  test("/getData - response should be { id: 1, name: 'John Smith' }", async () => {
    renderApp();
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByText('John Smith')).toBeInTheDocument();
  });
});
