import type { MultiStats, Stats } from 'webpack';

import type { InternalCompilerConf, Mode } from '../types.js';

import { ExitError, mockProcessExit } from '../__fixtures__/process-exit.js';
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
): jest.Mock => {
  const compiler = { name: 'compiler' };
  const webpack = jest.fn((_config: unknown, callback: WebpackCallback) => {
    callback(error, error ? undefined : runStats);

    return compiler;
  });

  expect(run([{ mode }], mode, webpack as never, runConf)).toEqual({
    compiler,
    conf: runConf,
    webpackConfig: [{ mode }],
  });

  return webpack;
};

const flushPromises = async (): Promise<void> => {
  await new Promise(process.nextTick);
};

describe('run', () => {
  let exitSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('logs a development error and keeps watching', () => {
      runWith('development', new Error('syntax error'));

      expect(errorSpy).toHaveBeenCalledWith('syntax error');
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it('exits with code 1 on a production error', () => {
      exitSpy.mockRestore();
      mockProcessExit();

      expect(() => runWith('production', new Error('broken'))).toThrow(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith('broken');
      expect(log).not.toHaveBeenCalled();
    });

    it('exits with code 1 when compiling the library sources fails', async () => {
      (sourceCompiler as jest.Mock).mockRejectedValueOnce(new Error('babel failed'));

      runWith('production', null, { ...conf, library: 'MyLib' });
      await flushPromises();

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(log).not.toHaveBeenCalled();
    });

    it('exits with code 1 when a production build has compilation errors', async () => {
      const failedStats = createStats(true);

      runWith('production', null, conf, failedStats);
      await flushPromises();

      expect(log).toHaveBeenCalledWith(failedStats);
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('positive cases', () => {
    it('does nothing after a successful development build', () => {
      runWith('development', null);

      expect(log).not.toHaveBeenCalled();
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it('logs the stats and exits with code 0 after a production build', async () => {
      runWith('production', null);
      await flushPromises();

      expect(sourceCompiler).not.toHaveBeenCalled();
      expect(log).toHaveBeenCalledWith(stats);
      expect(exitSpy).toHaveBeenCalledWith(0);
    });

    it('compiles library sources before logging a production library build', async () => {
      const libraryConf = { ...conf, library: 'MyLib' };

      runWith('production', null, libraryConf);
      await flushPromises();

      expect(sourceCompiler).toHaveBeenCalledWith(libraryConf);
      expect((sourceCompiler as jest.Mock).mock.invocationCallOrder[0]).toBeLessThan(
        (log as jest.Mock).mock.invocationCallOrder[0] ?? 0,
      );
    });
  });
});
