import { cleanup, render } from '@testing-library/react';
import React from 'react';

import { MyComponent } from './my-component';

afterEach(cleanup);

describe('This will test MyComponent', () => {
  test('renders message', () => {
    const { getByText } = render(<MyComponent firstName="Alejandro" lastName="Roman" />);
    expect(getByText('Hi Alejandro Roman!')).toBeInTheDocument();
  });
});
