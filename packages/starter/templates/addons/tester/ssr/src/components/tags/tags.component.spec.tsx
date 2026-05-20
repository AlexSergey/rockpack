import { render, screen } from '@testing-library/react';

import { Tags } from './tags.component';

describe('Tags', () => {
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
