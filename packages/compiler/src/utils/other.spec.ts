import { capitalize, getMajorVersion, getTitle } from './other.js';

describe('other utils', () => {
  describe('negative cases', () => {
    it('returns false for a version without a dot', () => {
      expect(getMajorVersion('19')).toBe(false);
    });

    it('returns false for a missing package.json', () => {
      expect(getTitle(null)).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('capitalizes the first letter', () => {
      expect(capitalize('esm')).toBe('Esm');
    });

    it('returns the major part of a version', () => {
      expect(getMajorVersion('19.2.0')).toBe('19');
    });

    it('turns underscores in the package name into spaces', () => {
      expect(getTitle({ name: 'my_app' })).toBe('my app');
    });
  });
});
