import { getMode } from '@rockpack/utils';
import { createServer } from 'livereload';

import type { InternalCompilerConf } from '../types.js';

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
    global.ISOMORPHIC = undefined;
    global.CONFIG_ONLY = undefined;
    global.LIVE_RELOAD_PORT = undefined;
    global.LIVE_RELOAD_SERVER = undefined;
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

    it('ignores compilers that resolved to nothing', async () => {
      await expect(isomorphicCompiler(result('frontendCompiler'), Promise.resolve(undefined))).rejects.toThrow(
        'backendCompiler is required to set isomorphicCompiler',
      );
      expect(lrServer.close).toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('starts live reload and marks the build as isomorphic', async () => {
      await isomorphicCompiler(result('frontendCompiler'), result('backendCompiler'));

      expect(global.ISOMORPHIC).toBe(true);
      expect(global.CONFIG_ONLY).toBe(true);
      expect(global.LIVE_RELOAD_PORT).toBe(35729);
      expect(global.LIVE_RELOAD_SERVER).toBe(lrServer);
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
  });
});
