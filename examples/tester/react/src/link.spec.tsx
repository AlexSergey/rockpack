import { render } from '@testing-library/react';
import React from 'react';

import { Link } from './link';

describe('Link', () => {
  test('should render correctly', () => {
    const tree = render(<Link title="mockTitle" url="mockUrl" />);
    expect(tree).toMatchSnapshot();
  });
});
