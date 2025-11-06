import React from 'react';
import { render } from '@testing-library/react'
import Link from './Link';

describe('Link', () => {
  test('should render correctly', () => {
    const tree = render(<Link title="mockTitle" url="mockUrl" />);

    expect(tree).toMatchSnapshot();
  });
});
