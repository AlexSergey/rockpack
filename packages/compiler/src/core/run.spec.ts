import type { MultiStats, Stats } from 'webpack';

import type { InternalCompilerConf, Mode } from '../types.js';

import { buildSources } from '../compilers/source-compiler.js';
import { RockpackError } from '../errors/rockpack-error.js';
import { run } from './run.js';

jest.mock('../compilers/source-compiler.js', () => ({ buildSources: jest.fn(() => Promise.resolve()) }));

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
    finished: expect.any(Promise) as unknown,
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
    it('leaves a development error to the reporter and keeps watching', async () => {
      const compiler = runWith('development', new Error('syntax error'));
      await settle();

      expect(errorSpy).not.toHaveBeenCalled();
      expect(compiler.close).not.toHaveBeenCalled();
      expect(process.exitCode).toBe(originalExitCode);
    });

    it('marks a fatal production error and closes the compiler', async () => {
      const compiler = runWith('production', new Error('broken'));
      await settle();

      expect(errorSpy).not.toHaveBeenCalled();
      expect(process.exitCode).toBe(1);
      expect(compiler.close).toHaveBeenCalled();
    });

    it('prints an error from applying the config, when webpack returns no compiler', async () => {
      const webpack = jest.fn((_config: unknown, callback: WebpackCallback) => {
        setImmediate(() => callback(new Error('Missing environment variable: TOKEN'), undefined));

        return null;
      });

      const { finished } = run([{ mode: 'production' }], 'production', webpack as never, conf);

      await expect(finished).resolves.toMatchObject({ success: false });
      expect(errorSpy).toHaveBeenCalledWith('Missing environment variable: TOKEN');
      expect(process.exitCode).toBe(1);
    });

    it('rejects finished with the error from applying the config in development', async () => {
      const cause = new Error('Missing environment variable: TOKEN');
      const webpack = jest.fn((_config: unknown, callback: WebpackCallback) => {
        setImmediate(() => callback(cause, undefined));

        return null;
      });

      const { compiler, finished } = run([{ mode: 'development' }], 'development', webpack as never, conf);

      expect(compiler).toBeNull();
      await expect(finished).rejects.toMatchObject({
        cause,
        code: 'BUILD_FAILED',
        message: 'Missing environment variable: TOKEN',
      });
    });

    it('prints and marks a failed library source build', async () => {
      (buildSources as jest.Mock).mockRejectedValueOnce(new RockpackError('BUILD_FAILED', 'babel failed'));

      const compiler = runWith('production', null, { ...conf, library: 'MyLib' });
      await settle();

      expect(errorSpy).toHaveBeenCalledWith('[rockpack] BUILD_FAILED: babel failed');
      expect(process.exitCode).toBe(1);
      expect(compiler.close).toHaveBeenCalled();
    });

    it('builds no library sources for a bundle with compilation errors', async () => {
      runWith('production', null, { ...conf, library: 'MyLib' }, createStats(true));
      await settle();

      expect(buildSources).not.toHaveBeenCalled();
      expect(process.exitCode).toBe(1);
    });

    it('marks a production build with compilation errors', async () => {
      runWith('production', null, conf, createStats(true));
      await settle();

      expect(process.exitCode).toBe(1);
    });
  });

  describe('positive cases', () => {
    it('settles finished with the outcome once the compiler is closed', async () => {
      const compiler = { close: jest.fn((callback: () => void) => callback()) };
      const webpack = jest.fn((_config: unknown, callback: WebpackCallback) => {
        setImmediate(() => callback(null, createStats(true)));

        return compiler;
      });

      const { finished } = run([{ mode: 'production' }], 'production', webpack as never, conf);

      await expect(finished).resolves.toMatchObject({ success: false });
      expect(compiler.close).toHaveBeenCalled();
    });

    it('does nothing after a successful development build', async () => {
      const compiler = runWith('development', null);
      await settle();

      expect(compiler.close).not.toHaveBeenCalled();
    });

    it('closes the compiler after a successful production build', async () => {
      const compiler = runWith('production', null);
      await settle();

      expect(buildSources).not.toHaveBeenCalled();
      expect(process.exitCode).toBe(originalExitCode);
      expect(compiler.close).toHaveBeenCalled();
    });

    it('compiles library sources before closing a production library build', async () => {
      const libraryConf = { ...conf, library: 'MyLib' };

      const compiler = runWith('production', null, libraryConf);
      await settle();

      expect(buildSources).toHaveBeenCalledWith(libraryConf, expect.objectContaining({ interactive: false }));
      expect((buildSources as jest.Mock).mock.invocationCallOrder[0]).toBeLessThan(
        compiler.close.mock.invocationCallOrder[0] ?? 0,
      );
    });
  });
});
