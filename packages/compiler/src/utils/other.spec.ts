import { capitalize, getMajorVersion, getRandomInt, getTitle } from './other.js';

describe('other utils', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('returns an empty string when capitalizing a non-string', () => {
      expect(capitalize(42 as unknown as string)).toBe('');
    });

    it('returns false for a version without a dot', () => {
      expect(getMajorVersion('19')).toBe(false);
    });

    it('returns false for a non-string version', () => {
      expect(getMajorVersion(19 as unknown as string)).toBe(false);
    });

    it('returns false for a missing package.json', () => {
      expect(getTitle(null)).toBe(false);
      expect(getTitle(undefined)).toBe(false);
    });

    it('returns false for a package.json without a name', () => {
      expect(getTitle({})).toBe(false);
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

    it('returns random integers within inclusive bounds', () => {
      jest.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.9999);

      expect([getRandomInt(1.2, 5.8), getRandomInt(1.2, 5.8)]).toEqual([2, 5]);
    });
  });
});
