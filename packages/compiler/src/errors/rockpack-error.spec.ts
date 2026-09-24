import { RockpackError } from './rockpack-error.js';

describe('RockpackError', () => {
  describe('negative cases', () => {
    it('is an Error with its own name', () => {
      const error = new RockpackError('INVALID_CONFIG', 'broken');

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('RockpackError');
    });
  });

  describe('positive cases', () => {
    it('keeps the code, message and cause', () => {
      const cause = new Error('root cause');
      const error = new RockpackError('BUILD_FAILED', 'build failed', { cause });

      expect({ cause: error.cause, code: error.code, message: error.message }).toEqual({
        cause,
        code: 'BUILD_FAILED',
        message: 'build failed',
      });
    });
  });
});
