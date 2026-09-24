import { render, screen } from '@testing-library/react';
import React from 'react';

import { Link } from './link';

describe('Link', () => {
  describe('negative cases', () => {
    it('renders an empty link without a title', () => {
      render(<Link title="" url="mockUrl" />);

      expect(screen.getByRole('link')).toBeEmptyDOMElement();
    });
  });

  describe('positive cases', () => {
    it('renders correctly', () => {
      const { asFragment } = render(<Link title="mockTitle" url="mockUrl" />);

      expect(asFragment()).toMatchSnapshot();
    });
  });
});
