// These specs cover the deprecated promise form next to the options form.
/* eslint-disable @typescript-eslint/no-deprecated */
import { getMode } from '@rockpack/utils';
import { createServer } from 'livereload';

import type { CompilerConf, InternalCompilerConf } from '../types.js';

import { getLegacyIsomorphicContext } from '../core/compile-context.js';
import { compile } from '../core/compile.js';
import { run } from '../core/run.js';
import { isomorphicCompiler } from './isomorphic-compiler.js';

jest.mock('@rockpack/utils', () => ({
  ...jest.requireActual<Record<string, unknown>>('@rockpack/utils'),
  getMode: jest.fn(),
  setMode: jest.fn(),
}));
jest.mock('livereload', () => ({ createServer: jest.fn() }));
jest.mock('webpack', () => ({ __esModule: true, default: 'webpack' }));
jest.mock('../core/run.js', () => ({ run: jest.fn() }));
jest.mock('../core/compile.js', () => ({ compile: jest.fn() }));
jest.mock('../error-handler.js', () => ({ errorHandler: jest.fn() }));

type CompileResult = {
  conf: InternalCompilerConf;
  webpackConfig: { name: string };
};

const lrServer = { close: jest.fn(), config: { port: 35729 }, refresh: jest.fn() };

const DISTS: Record<string, string> = { backendCompiler: 'dist/index.js', frontendCompiler: 'public/index.js' };

const result = (compilerName: string, overrides: Partial<InternalCompilerConf> = {}): Promise<CompileResult> =>
  Promise.resolve({
    conf: { compilerName, dist: DISTS[compilerName] ?? 'dist/index.js', src: 'src/index.ts', ...overrides },
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('exits without a frontend compiler', async () => {
      await expect(isomorphicCompiler(result('backendCompiler'))).rejects.toThrow(
        'isomorphicCompiler supported only frontendCompiler',
      );
      expect(lrServer.close).toHaveBeenCalled();
    });

    it('exits without a backend compiler', async () => {
      await expect(isomorphicCompiler(result('frontendCompiler'))).rejects.toThrow(
        'backendCompiler is required to set isomorphicCompiler',
      );
      expect(lrServer.close).toHaveBeenCalled();
    });

    it.each(['dist', 'src'] as const)('exits when a compiler has no %s', async (option) => {
      await expect(
        isomorphicCompiler(result('frontendCompiler'), result('backendCompiler', { [option]: undefined })),
      ).rejects.toThrow(`You should set ${option} option to backendCompiler`);
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

    it('ignores compilers that resolved to nothing', async () => {
      await expect(isomorphicCompiler(result('frontendCompiler'), Promise.resolve(undefined))).rejects.toThrow(
        'backendCompiler is required to set isomorphicCompiler',
      );
      expect(lrServer.close).toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('shares an isomorphic context with the live reload server while the legacy children resolve', async () => {
      let seen: ReturnType<typeof getLegacyIsomorphicContext>;
      const frontend = result('frontendCompiler').then((value) => {
        seen = getLegacyIsomorphicContext();

        return value;
      });

      await isomorphicCompiler(frontend, result('backendCompiler'));

      expect(seen).toEqual({
        configOnly: true,
        isomorphic: true,
        liveReload: { port: 35729, server: lrServer },
      });
      expect(getLegacyIsomorphicContext()).toBeUndefined();
    });

    it('runs every webpack config together', async () => {
      await isomorphicCompiler(result('frontendCompiler'), result('backendCompiler'));

      expect(run).toHaveBeenCalledWith(
        [{ name: 'frontendCompiler' }, { name: 'backendCompiler' }],
        'development',
        'webpack',
        expect.objectContaining({ compilerName: 'frontendCompiler' }),
      );
    });

    it('compiles the frontend and backend confs with an isomorphic context', async () => {
      const frontendCallback = jest.fn();
      (compile as jest.Mock).mockImplementation((conf: Partial<InternalCompilerConf>) =>
        result(conf.compilerName ?? '', { dist: conf.dist ?? '' }),
      );
      const frontend: Partial<CompilerConf> = { dist: 'public/index.js', src: 'src/client.tsx' };
      const backend: Partial<CompilerConf> = { dist: 'dist/index.js', src: 'src/server.tsx' };

      await isomorphicCompiler({ backend, frontend, frontendCallback });

      const context = { configOnly: true, isomorphic: true, liveReload: { port: 35729, server: lrServer } };
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
      );
      expect(getLegacyIsomorphicContext()).toBeUndefined();
    });
  });
});
