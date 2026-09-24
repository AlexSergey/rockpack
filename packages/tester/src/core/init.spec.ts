import { runCLI } from 'jest';

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
  const originalExitCode = process.exitCode;
  let exitSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    configCompilerMock.mockReturnValue({ argv: { config: '{}' }, config: {} });
  });

  afterEach(() => {
    process.exitCode = originalExitCode;
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('reports failed tests through the exit code without exiting', async () => {
      mockRunResult(false);

      await expect(init()).resolves.toEqual({ success: false });
      expect(errorSpy).toHaveBeenCalledWith('❌ Some tests have failed!');
      expect(process.exitCode).toBe(1);
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it('reports a jest error through the exit code and resolves to undefined', async () => {
      const error = new Error('jest crashed');
      runCLIMock.mockRejectedValue(error);

      await expect(init()).resolves.toBeUndefined();
      expect(errorSpy).toHaveBeenCalledWith('Jest encountered an error:', error);
      expect(process.exitCode).toBe(1);
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it('reports an invalid config like a jest error', async () => {
      const error = new Error('bad config');
      configCompilerMock.mockImplementation(() => {
        throw error;
      });

      await expect(init()).resolves.toBeUndefined();
      expect(errorSpy).toHaveBeenCalledWith('Jest encountered an error:', error);
      expect(runCLIMock).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('reports passed tests without exiting', async () => {
      mockRunResult(true);

      await expect(init()).resolves.toEqual({ success: true });

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
