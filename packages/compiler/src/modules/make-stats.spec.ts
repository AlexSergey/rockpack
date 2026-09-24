import { makeStats } from './make-stats.js';

describe('makeStats', () => {
  describe('negative cases', () => {
    it('shows only errors without debug', () => {
      expect(makeStats({})).toBe('errors-only');
    });
  });

  describe('positive cases', () => {
    it('shows error details in debug mode', () => {
      expect(makeStats({ debug: true })).toEqual({ errorDetails: true });
    });
  });
});
