// These specs cover the deprecated promise form next to the options form.
/* eslint-disable @typescript-eslint/no-deprecated */

import { getMode } from '@rockpack/utils';
import { createServer } from 'livereload';

import type { CompilerConf, InternalCompilerConf } from '../types.js';

import { getLegacyIsomorphicContext } from '../core/compile-context.js';
import { compile } from '../core/compile.js';
import { run } from '../core/run.js';
import { RockpackError } from '../errors/rockpack-error.js';
import { createReporter } from '../reporter/reporter.js';
import { isomorphicCompiler } from './isomorphic-compiler.js';

jest.mock('@rockpack/utils', () => ({
  ...jest.requireActual<Record<string, unknown>>('@rockpack/utils'),
  getMode: jest.fn(),
  setMode: jest.fn(),
}));
jest.mock('livereload', () => ({ createServer: jest.fn() }));
jest.mock('../utils/find-free-port.js', () => ({
  fpPromise: (port: number): Promise<number> => Promise.resolve(port + 1),
}));
jest.mock('webpack', () => ({ __esModule: true, default: 'webpack' }));
jest.mock('../core/run.js', () => ({ run: jest.fn() }));
jest.mock('../core/compile.js', () => ({ compile: jest.fn() }));
jest.mock('../error-handler.js', () => ({ errorHandler: jest.fn() }));
jest.mock('../reporter/reporter.js', () => ({ createReporter: jest.fn((options: object) => ({ options })) }));

// The reporter createReporter returns for these options (the mock echoes them).
const reporter = (progress = true, debug = false): unknown => ({ options: { debug, progress } });

type CompileResult = {
  conf: InternalCompilerConf;
  kind: 'config';
  webpackConfig: { name: string };
};

const lrServer = { close: jest.fn(), config: { port: 35729 }, refresh: jest.fn() };
const compiler = {
  close: jest.fn((callback: () => void) => {
    callback();
  }),
};

const DISTS: Record<string, string> = { backendCompiler: 'dist/index.js', frontendCompiler: 'public/index.js' };

const result = (compilerName: string, overrides: Partial<InternalCompilerConf> = {}): Promise<CompileResult> =>
  Promise.resolve({
    conf: { compilerName, dist: DISTS[compilerName] ?? 'dist/index.js', src: 'src/index.ts', ...overrides },
    kind: 'config',
    webpackConfig: { name: compilerName },
  });

describe('isomorphicCompiler', () => {
  const originalExitCode = process.exitCode;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // The error boundary marks the exit code on purpose; keep the Jest process status clean.
    process.exitCode = originalExitCode;
  });

  beforeEach(() => {
    (getMode as jest.Mock).mockReturnValue('development');
    (createServer as jest.Mock).mockReturnValue(lrServer);
    (run as jest.Mock).mockReturnValue({ compiler, finished: new Promise(() => undefined) });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('exits without a frontend compiler', async () => {
      await expect(isomorphicCompiler(result('backendCompiler'))).rejects.toThrow(
        'frontendCompiler is required to set isomorphicCompiler',
      );
      expect(lrServer.close).toHaveBeenCalled();
    });

    it('exits without a backend compiler', async () => {
      await expect(isomorphicCompiler(result('frontendCompiler'))).rejects.toThrow(
        'backendCompiler is required to set isomorphicCompiler',
      );
      expect(lrServer.close).toHaveBeenCalled();
    });

    it('exits when the frontend and the backend write to the same file', async () => {
      await expect(
        isomorphicCompiler(result('frontendCompiler', { dist: 'dist/index.js' }), result('backendCompiler')),
      ).rejects.toThrow('frontendCompiler and backendCompiler write to the same file');
      expect(lrServer.close).toHaveBeenCalled();
    });

    it('rejects option confs whose outputs collide', async () => {
      (compile as jest.Mock).mockImplementation((conf: Partial<InternalCompilerConf>) =>
        result(conf.compilerName ?? '', { dist: 'dist/index.js' }),
      );

      await expect(isomorphicCompiler({ backend: {}, frontend: {} })).rejects.toThrow(
        'frontendCompiler and backendCompiler write to the same file',
      );
      expect(lrServer.close).toHaveBeenCalled();
    });

    it('rejects with the error webpack reported when it could not apply the config and closes live reload', async () => {
      const error = new RockpackError('BUILD_FAILED', 'Missing environment variable: TOKEN');
      (run as jest.Mock).mockReturnValue({ compiler: null, finished: Promise.reject(error) });

      await expect(isomorphicCompiler(result('frontendCompiler'), result('backendCompiler'))).rejects.toBe(error);
      expect(lrServer.close).toHaveBeenCalled();
      expect(process.exitCode).toBe(1);
    });

    it('resolves a failed production build with success false', async () => {
      (getMode as jest.Mock).mockReturnValue('production');
      (run as jest.Mock).mockReturnValue({ compiler, finished: Promise.resolve({ stats: 'stats', success: false }) });

      await expect(isomorphicCompiler(result('frontendCompiler'), result('backendCompiler'))).resolves.toEqual({
        kind: 'build',
        stats: 'stats',
        success: false,
      });
    });

    it('ignores compilers that resolved to nothing', async () => {
      await expect(isomorphicCompiler(result('frontendCompiler'), Promise.resolve(undefined))).rejects.toThrow(
        'backendCompiler is required to set isomorphicCompiler',
      );
      expect(lrServer.close).toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('turns the progress bars off when either conf asks for it', async () => {
      (compile as jest.Mock).mockImplementation((conf: Partial<InternalCompilerConf>) =>
        result(conf.compilerName ?? ''),
      );

      await isomorphicCompiler({ backend: { progress: false }, frontend: {} });

      expect(createReporter).toHaveBeenCalledWith({ debug: false, progress: false });
    });

    it('prints the debug output when either conf asks for it', async () => {
      (compile as jest.Mock).mockImplementation((conf: Partial<InternalCompilerConf>) =>
        result(conf.compilerName ?? ''),
      );

      await isomorphicCompiler({ backend: {}, frontend: { debug: true } });

      expect(createReporter).toHaveBeenCalledWith({ debug: true, progress: true });
    });

    it('resolves after the production build has finished', async () => {
      (getMode as jest.Mock).mockReturnValue('production');
      let finish: (outcome: unknown) => void = () => undefined;
      (run as jest.Mock).mockReturnValue({
        compiler,
        finished: new Promise((resolve) => {
          finish = resolve;
        }),
      });
      let resolved = false;

      const pending = isomorphicCompiler(result('frontendCompiler'), result('backendCompiler')).then((value) => {
        resolved = true;

        return value;
      });
      await new Promise(setImmediate);
      expect(resolved).toBe(false);
      finish({ stats: 'stats', success: true });

      await expect(pending).resolves.toEqual({ kind: 'build', stats: 'stats', success: true });
    });

    it('watches in development until stop() closes the compilers and the live reload server', async () => {
      const watching = await isomorphicCompiler(result('frontendCompiler'), result('backendCompiler'));

      expect(watching).toEqual({ kind: 'watch', stop: expect.any(Function) as unknown });
      expect(compiler.close).not.toHaveBeenCalled();
      expect(lrServer.close).not.toHaveBeenCalled();

      await (watching as { stop: () => Promise<void> }).stop();

      expect(compiler.close).toHaveBeenCalled();
      expect(lrServer.close).toHaveBeenCalled();
    });

    it('shares an isomorphic context with the live reload server while the legacy children resolve', async () => {
      let seen: Awaited<ReturnType<typeof getLegacyIsomorphicContext>>;
      const frontend = result('frontendCompiler').then(async (value) => {
        seen = await getLegacyIsomorphicContext();

        return value;
      });

      await isomorphicCompiler(frontend, result('backendCompiler'));

      expect(seen).toEqual({
        configOnly: true,
        isomorphic: true,
        liveReload: { port: 35729, server: lrServer },
        reporter: reporter(),
      });
      expect(createServer).toHaveBeenCalledWith({ port: 35730 });
      expect(getLegacyIsomorphicContext()).toBeUndefined();
    });

    it('starts no live reload server in production', async () => {
      (getMode as jest.Mock).mockReturnValue('production');
      (run as jest.Mock).mockReturnValue({ compiler, finished: Promise.resolve({ stats: 'stats', success: true }) });
      (compile as jest.Mock).mockImplementation((conf: Partial<InternalCompilerConf>) =>
        result(conf.compilerName ?? '', { dist: conf.dist ?? '' }),
      );

      await isomorphicCompiler({ backend: { dist: 'dist/index.js' }, frontend: { dist: 'public/index.js' } });

      expect(createServer).not.toHaveBeenCalled();
      expect(compile).toHaveBeenCalledWith(expect.anything(), null, true, {
        configOnly: true,
        isomorphic: true,
        reporter: reporter(),
      });
    });

    it('runs every webpack config together', async () => {
      await isomorphicCompiler(result('frontendCompiler'), result('backendCompiler'));

      expect(run).toHaveBeenCalledWith(
        [{ name: 'frontendCompiler' }, { name: 'backendCompiler' }],
        'development',
        'webpack',
        expect.objectContaining({ compilerName: 'frontendCompiler' }),
        reporter(),
      );
    });

    it('ignores the folders both compilers write in each watching build', async () => {
      const watching = (compilerName: string, ignored: RegExp | string[]): Promise<unknown> =>
        result(compilerName).then((compiled) => ({ ...compiled, webpackConfig: { watchOptions: { ignored } } }));

      await isomorphicCompiler(
        watching('frontendCompiler', ['/app/public', '/app/node_modules/.cache']) as Promise<undefined>,
        watching('backendCompiler', ['/app/dist', '/app/node_modules/.cache']) as Promise<undefined>,
      );

      const ignored = ['/app/public', '/app/node_modules/.cache', '/app/dist'];
      expect(run).toHaveBeenCalledWith(
        [{ watchOptions: { ignored } }, { watchOptions: { ignored } }],
        'development',
        'webpack',
        expect.anything(),
        reporter(),
      );
    });

    it('keeps a RegExp a callback set for the watched files', async () => {
      const frontendConfig = { watchOptions: { ignored: /generated/ } };
      const backendConfig = { watchOptions: { ignored: ['/app/dist'] } };

      await isomorphicCompiler(
        result('frontendCompiler').then((compiled) => ({
          ...compiled,
          webpackConfig: frontendConfig,
        })) as Promise<undefined>,
        result('backendCompiler').then((compiled) => ({
          ...compiled,
          webpackConfig: backendConfig,
        })) as Promise<undefined>,
      );

      expect(frontendConfig.watchOptions.ignored).toEqual(/generated/);
      expect(backendConfig.watchOptions.ignored).toEqual(['/app/dist']);
    });

    it('compiles the frontend and backend confs with an isomorphic context', async () => {
      const frontendCallback = jest.fn();
      (compile as jest.Mock).mockImplementation((conf: Partial<InternalCompilerConf>) =>
        result(conf.compilerName ?? '', { dist: conf.dist ?? '' }),
      );
      const frontend: Partial<CompilerConf> = { dist: 'public/index.js', src: 'src/client.tsx' };
      const backend: Partial<CompilerConf> = { dist: 'dist/index.js', src: 'src/server.tsx' };

      await isomorphicCompiler({ backend, frontend, frontendCallback });

      const context = {
        configOnly: true,
        isomorphic: true,
        liveReload: { port: 35729, server: lrServer },
        reporter: reporter(),
      };
      expect(compile).toHaveBeenCalledWith(
        expect.objectContaining({ ...frontend, compilerName: 'frontendCompiler' }),
        frontendCallback,
        true,
        context,
      );
      expect(compile).toHaveBeenCalledWith(
        expect.objectContaining({ ...backend, compilerName: 'backendCompiler', nodejs: true }),
        null,
        true,
        context,
      );
      expect(run).toHaveBeenCalledWith(
        [{ name: 'frontendCompiler' }, { name: 'backendCompiler' }],
        'development',
        'webpack',
        expect.objectContaining({ compilerName: 'frontendCompiler' }),
        reporter(),
      );
      expect(getLegacyIsomorphicContext()).toBeUndefined();
    });
  });
});
