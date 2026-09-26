import type { RenderResult } from '@testing-library/react';

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

import { App } from './app';
import { MockRest, Rest } from './rest';

const renderApp = (): RenderResult =>
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
  describe('negative cases', () => {
    test('shows no user before the request is sent', () => {
      renderApp();
      expect(screen.queryByText('John Smith')).not.toBeInTheDocument();
    });
  });

  describe('positive cases', () => {
    test("/getData - response should be { id: 1, name: 'John Smith' }", async () => {
      renderApp();
      fireEvent.click(screen.getByRole('button'));
      expect(await screen.findByText('John Smith')).toBeInTheDocument();
    });
  });
});
