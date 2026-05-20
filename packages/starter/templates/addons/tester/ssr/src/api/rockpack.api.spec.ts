import { fetchRockpackDescription } from './rockpack.api';

describe('fetchRockpackDescription', () => {
  describe('positive cases', () => {
    it('resolves with the project description', async () => {
      const result = await fetchRockpackDescription();

      expect(result).toBe(
        'Zero-config React with built-in SSR, automated quality gates, and AI-ready project structure - ship clean code whether you write it yourself or with an AI assistant.',
      );
    });
  });
});
