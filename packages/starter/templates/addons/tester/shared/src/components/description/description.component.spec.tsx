import { render, screen } from '@testing-library/react';

import { Description } from './description.component';

describe('Description', () => {
  describe('negative cases', () => {
    it('renders error message when error is true', () => {
      render(<Description error loading={false} text="" />);

      expect(screen.getByText('Failed to load description')).toBeInTheDocument();
    });
  });

  describe('positive cases', () => {
    it('renders skeleton without text when loading', () => {
      render(<Description error={false} loading text="Some description" />);

      expect(screen.queryByText('Some description')).not.toBeInTheDocument();
      expect(screen.queryByText('Failed to load description')).not.toBeInTheDocument();
    });

    it('renders description text when loaded', () => {
      render(<Description error={false} loading={false} text="Some description" />);

      expect(screen.getByText('Some description')).toBeInTheDocument();
    });
  });
});
