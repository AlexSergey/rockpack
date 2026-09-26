import { render, screen } from '@testing-library/react';
import React from 'react';

import { MyComponent } from './my-component';

describe('MyComponent', () => {
  describe('negative cases', () => {
    it('keeps the greeting when the last name is empty', () => {
      render(<MyComponent firstName="Alejandro" lastName="" />);

      expect(screen.getByRole('heading')).toHaveTextContent('Hi Alejandro !');
    });
  });

  describe('positive cases', () => {
    it('renders the message', () => {
      render(<MyComponent firstName="Alejandro" lastName="Roman" />);

      expect(screen.getByText('Hi Alejandro Roman!')).toBeInTheDocument();
    });
  });
});
