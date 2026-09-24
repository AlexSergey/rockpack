import { fetchRockpackDescription } from './rockpack.api';

describe('fetchRockpackDescription', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('negative cases', () => {
    it('is still pending before the simulated latency passes', async () => {
      const onResolve = jest.fn();
      void fetchRockpackDescription().then(onResolve);

      await jest.advanceTimersByTimeAsync(599);

      expect(onResolve).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('resolves with the project description', async () => {
      const result = fetchRockpackDescription();

      await jest.advanceTimersByTimeAsync(600);

      await expect(result).resolves.toBe(
        'Zero-config React with built-in SSR, automated quality gates, and AI-ready project structure - ship clean code whether you write it yourself or with an AI assistant.',
      );
    });
  });
});
