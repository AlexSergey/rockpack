import { render, screen } from '@testing-library/react';

import { Tags } from './tags.component';

describe('Tags', () => {
  describe('negative cases', () => {
    it('renders each tag only once', () => {
      render(<Tags />);

      expect(screen.getAllByText('SSR')).toHaveLength(1);
    });
  });

  describe('positive cases', () => {
    it('renders all tags', () => {
      render(<Tags />);

      expect(screen.getByText('Zero config')).toBeInTheDocument();
      expect(screen.getByText('React 19')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('SSR')).toBeInTheDocument();
      expect(screen.getByText('AI-ready')).toBeInTheDocument();
      expect(screen.getByText('MIT')).toBeInTheDocument();
    });
  });
});
