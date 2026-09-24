import { getMajorVersion } from './get-major-version';

describe('getMajorVersion', () => {
  describe('negative cases', () => {
    it('throws on a malformed version', () => {
      expect(() => getMajorVersion('not-a-version')).toThrow(TypeError);
    });

    it('throws on a range that no version satisfies', () => {
      expect(() => getMajorVersion('>1.0.0 <1.0.0')).toThrow('Invalid semver range: >1.0.0 <1.0.0');
    });
  });

  describe('positive cases', () => {
    it('returns the major of an exact version', () => {
      expect(getMajorVersion('19.2.0')).toBe(19);
    });

    it('returns the minimum major of a range', () => {
      expect(getMajorVersion('^18.3.1')).toBe(18);
    });
  });
});
