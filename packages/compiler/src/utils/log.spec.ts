import { RockpackError } from '../errors/rockpack-error.js';
import { logError } from './log.js';

describe('logError', () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('writes to stderr, not stdout', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      logError(new RockpackError('BUILD_FAILED', 'babel failed'));

      expect(logSpy).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('prints the error code and message', () => {
      logError(new RockpackError('INVALID_CONFIG', 'port must be a positive integer'));

      expect(errorSpy).toHaveBeenCalledWith('[rockpack] INVALID_CONFIG: port must be a positive integer');
    });
  });
});
