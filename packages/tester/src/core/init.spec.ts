import { runCLI } from 'jest';

import { ExitError, mockProcessExit } from '../__fixtures__/process-exit.js';
import { configCompiler } from '../configs/config-compiler.js';
import { init } from './init.js';

jest.mock('jest', () => ({ runCLI: jest.fn() }));
jest.mock('../configs/config-compiler.js', () => ({ configCompiler: jest.fn() }));

const runCLIMock = runCLI as jest.MockedFunction<typeof runCLI>;
const configCompilerMock = configCompiler as jest.MockedFunction<typeof configCompiler>;

const mockRunResult = (success: boolean): void => {
  runCLIMock.mockResolvedValue({ results: { success } } as Awaited<ReturnType<typeof runCLI>>);
};

describe('init', () => {
  let exitSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    exitSpy = mockProcessExit();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    configCompilerMock.mockReturnValue({ config: '{}' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('reports failed tests and exits with code 1', async () => {
      mockRunResult(false);

      await expect(init()).rejects.toEqual(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith('❌ Some tests have failed!');
    });

    it('reports a jest error and exits with code 1', async () => {
      const error = new Error('jest crashed');
      runCLIMock.mockRejectedValue(error);

      await expect(init()).rejects.toEqual(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith('Jest encountered an error:', error);
    });
  });

  describe('positive cases', () => {
    it('reports passed tests without exiting', async () => {
      mockRunResult(true);

      await init();

      expect(logSpy).toHaveBeenCalledWith('✅ All tests have passed successfully!');
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it('runs jest with the compiled config in the current directory', async () => {
      mockRunResult(true);
      const opts = { src: './app' };
      const projectConfig = { testEnvironment: 'node' };

      await init(opts, projectConfig);

      expect(configCompilerMock).toHaveBeenCalledWith(opts, projectConfig);
      expect(runCLIMock).toHaveBeenCalledWith({ config: '{}' }, [process.cwd()]);
    });
  });
});
