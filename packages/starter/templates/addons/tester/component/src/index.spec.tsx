import { render, screen } from '@testing-library/react';

import RockpackComponent from './index';

describe('RockpackComponent', () => {
  describe('negative cases', () => {
    it('renders no interactive elements', () => {
      render(<RockpackComponent />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('positive cases', () => {
    it('renders the Rockpack title', () => {
      render(<RockpackComponent />);

      expect(screen.getByText(/Rockpack/i)).toBeInTheDocument();
    });
  });
});
