import { render, screen } from '@testing-library/react';

import { SpotlightSection } from './spotlight-section.component';

const POINTS = ['Point one', 'Point two'];
const VISUAL = <div data-testid="visual">Visual</div>;

describe('SpotlightSection', () => {
  describe('negative cases', () => {
    it('does not apply reversed layout by default', () => {
      const { container } = render(
        <SpotlightSection badge="Badge" description="Description" points={POINTS} title="Title" visual={VISUAL} />,
      );

      expect(container.querySelector('[class*="flex-row-reverse"]')).not.toBeInTheDocument();
    });
  });

  describe('positive cases', () => {
    it('renders badge, title, description and points', () => {
      render(
        <SpotlightSection
          badge="My Badge"
          description="My description"
          points={POINTS}
          title="My Title"
          visual={VISUAL}
        />,
      );

      expect(screen.getByText('My Badge')).toBeInTheDocument();
      expect(screen.getByText('My Title')).toBeInTheDocument();
      expect(screen.getByText('My description')).toBeInTheDocument();
      expect(screen.getByText('Point one')).toBeInTheDocument();
      expect(screen.getByText('Point two')).toBeInTheDocument();
    });

    it('renders visual content', () => {
      render(
        <SpotlightSection badge="Badge" description="Description" points={POINTS} title="Title" visual={VISUAL} />,
      );

      expect(screen.getByTestId('visual')).toBeInTheDocument();
    });

    it('applies reversed layout when reversed is true', () => {
      const { container } = render(
        <SpotlightSection
          badge="Badge"
          description="Description"
          points={POINTS}
          reversed
          title="Title"
          visual={VISUAL}
        />,
      );

      expect(container.querySelector('[class*="flex-row-reverse"]')).toBeInTheDocument();
    });
  });
});
