import { RockpackError } from '../errors/rockpack-error.js';
import { logError } from '../utils/log.js';
import { withErrorBoundary } from './error-boundary.js';

jest.mock('../utils/log.js', () => ({ logError: jest.fn() }));

describe('withErrorBoundary', () => {
  const originalExitCode = process.exitCode;

  afterEach(() => {
    process.exitCode = originalExitCode;
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('logs a RockpackError, marks the exit code and rejects', async () => {
      const error = new RockpackError('INVALID_CONFIG', 'broken config');

      await expect(withErrorBoundary(() => Promise.reject(error))).rejects.toBe(error);
      expect(logError).toHaveBeenCalledWith(error);
      expect(process.exitCode).toBe(1);
    });

    it('rethrows other errors untouched', async () => {
      const error = new Error('unexpected');

      await expect(withErrorBoundary(() => Promise.reject(error))).rejects.toBe(error);
      expect(logError).not.toHaveBeenCalled();
      expect(process.exitCode).toBe(originalExitCode);
    });
  });

  describe('positive cases', () => {
    it('resolves with the task result', async () => {
      await expect(withErrorBoundary(() => Promise.resolve('done'))).resolves.toBe('done');
    });
  });
});
