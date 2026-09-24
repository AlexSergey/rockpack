import { generateString } from './generate-string.js';

describe('generateString', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('returns an empty string for zero length', () => {
      expect(generateString(0)).toBe('');
    });
  });

  describe('positive cases', () => {
    it('returns alphanumeric strings of the requested length', () => {
      expect(generateString(32)).toMatch(/^[A-Z0-9]{32}$/i);
    });

    it('maps random values onto the charset bounds', () => {
      jest.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.9999);

      expect(generateString(2)).toBe('A9');
    });
  });
});
