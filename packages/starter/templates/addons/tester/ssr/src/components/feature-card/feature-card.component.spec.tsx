import { render, screen } from '@testing-library/react';

import { FeatureCard } from './feature-card.component';

describe('FeatureCard', () => {
  describe('positive cases', () => {
    it('renders icon, title and description', () => {
      render(<FeatureCard description="No config needed" icon="⚡" title="Zero Config" />);

      expect(screen.getByText('⚡')).toBeInTheDocument();
      expect(screen.getByText('Zero Config')).toBeInTheDocument();
      expect(screen.getByText('No config needed')).toBeInTheDocument();
    });
  });
});
