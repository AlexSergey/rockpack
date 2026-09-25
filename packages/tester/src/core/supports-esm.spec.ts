import { supportsEsm } from './supports-esm.js';

describe('supportsEsm', () => {
  describe('negative cases', () => {
    it('is false without --experimental-vm-modules', () => {
      expect(process.execArgv).not.toContain('--experimental-vm-modules');
      expect(supportsEsm()).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('returns a boolean', () => {
      expect(typeof supportsEsm()).toBe('boolean');
    });
  });
});
