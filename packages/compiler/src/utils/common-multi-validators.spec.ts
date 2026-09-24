import type { InternalCompilerConf } from '../types.js';

import { ExitError, mockProcessExit } from '../__fixtures__/process-exit.js';
import { commonMultiValidator } from './common-multi-validators.js';

const createConf = (compilerName?: string): InternalCompilerConf =>
  ({ compilerName, dist: 'dist/index.js', src: 'src/index.ts' }) as InternalCompilerConf;

describe('commonMultiValidator', () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockProcessExit();
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('exits for an empty config list', () => {
      expect(() => commonMultiValidator([])).toThrow(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith('The config is empty');
    });

    it('exits for a config without a compiler name', () => {
      expect(() => commonMultiValidator([createConf('frontendCompiler'), createConf()])).toThrow(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith('The config is invalid');
    });
  });

  describe('positive cases', () => {
    it('accepts named configs', () => {
      expect(() => commonMultiValidator([createConf('frontendCompiler'), createConf('backendCompiler')])).not.toThrow();
    });
  });
});
