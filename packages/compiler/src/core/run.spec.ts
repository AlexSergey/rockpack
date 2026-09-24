import type { MultiStats, Stats } from 'webpack';

import type { InternalCompilerConf, Mode } from '../types.js';

import { sourceCompiler } from '../compilers/source-compiler.js';
import { log } from '../utils/log.js';
import { run } from './run.js';

jest.mock('../compilers/source-compiler.js', () => ({ sourceCompiler: jest.fn(() => Promise.resolve()) }));
jest.mock('../utils/log.js', () => ({ log: jest.fn() }));

type WebpackCallback = (err: Error | null, stats: MultiStats | Stats | undefined) => void;

const conf: InternalCompilerConf = { dist: 'dist/index.js', src: 'src/index.ts' };
const createStats = (hasErrors: boolean): Stats => ({ hasErrors: () => hasErrors }) as unknown as Stats;
const stats = createStats(false);

const runWith = (
  mode: Mode,
  error: Error | null,
  runConf: InternalCompilerConf = conf,
  runStats: Stats = stats,
): { close: jest.Mock } => {
  const compiler = { close: jest.fn((callback: () => void) => callback()), name: 'compiler' };
  const webpack = jest.fn((_config: unknown, callback: WebpackCallback) => {
    setImmediate(() => callback(error, error ? undefined : runStats));

    return compiler;
  });

  expect(run([{ mode }], mode, webpack as never, runConf)).toEqual({
    compiler,
    conf: runConf,
    webpackConfig: [{ mode }],
  });

  return compiler;
};

const settle = async (): Promise<void> => {
  for (let i = 0; i < 5; i += 1) {
    await new Promise(setImmediate);
  }
};

describe('run', () => {
  const originalExitCode = process.exitCode;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.exitCode = originalExitCode;
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('logs a development error and keeps watching', async () => {
      const compiler = runWith('development', new Error('syntax error'));
      await settle();

      expect(errorSpy).toHaveBeenCalledWith('syntax error');
      expect(compiler.close).not.toHaveBeenCalled();
      expect(process.exitCode).toBe(originalExitCode);
    });

    it('marks a fatal production error and closes the compiler', async () => {
      const compiler = runWith('production', new Error('broken'));
      await settle();

      expect(errorSpy).toHaveBeenCalledWith('broken');
      expect(process.exitCode).toBe(1);
      expect(log).not.toHaveBeenCalled();
      expect(compiler.close).toHaveBeenCalled();
    });

    it('marks a failed library source build without logging the stats', async () => {
      (sourceCompiler as jest.Mock).mockRejectedValueOnce(new Error('babel failed'));

      const compiler = runWith('production', null, { ...conf, library: 'MyLib' });
      await settle();

      expect(process.exitCode).toBe(1);
      expect(log).not.toHaveBeenCalled();
      expect(compiler.close).toHaveBeenCalled();
    });

    it('marks a production build with compilation errors', async () => {
      const failedStats = createStats(true);

      runWith('production', null, conf, failedStats);
      await settle();

      expect(log).toHaveBeenCalledWith(failedStats);
      expect(process.exitCode).toBe(1);
    });
  });

  describe('positive cases', () => {
    it('does nothing after a successful development build', async () => {
      const compiler = runWith('development', null);
      await settle();

      expect(log).not.toHaveBeenCalled();
      expect(compiler.close).not.toHaveBeenCalled();
    });

    it('logs the stats and closes the compiler after a successful production build', async () => {
      const compiler = runWith('production', null);
      await settle();

      expect(sourceCompiler).not.toHaveBeenCalled();
      expect(log).toHaveBeenCalledWith(stats);
      expect(process.exitCode).toBe(originalExitCode);
      expect(compiler.close).toHaveBeenCalled();
    });

    it('compiles library sources before logging a production library build', async () => {
      const libraryConf = { ...conf, library: 'MyLib' };

      runWith('production', null, libraryConf);
      await settle();

      expect(sourceCompiler).toHaveBeenCalledWith(libraryConf);
      expect((sourceCompiler as jest.Mock).mock.invocationCallOrder[0]).toBeLessThan(
        (log as jest.Mock).mock.invocationCallOrder[0] ?? 0,
      );
    });
  });
});
