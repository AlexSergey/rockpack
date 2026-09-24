import { getMode } from '@rockpack/utils';
import { createServer } from 'livereload';

import type { InternalCompilerConf } from '../types.js';

import { ExitError, mockProcessExit } from '../__fixtures__/process-exit.js';
import { run } from '../core/run.js';
import { isomorphicCompiler } from './isomorphic-compiler.js';

jest.mock('@rockpack/utils', () => ({ getMode: jest.fn(), setMode: jest.fn() }));
jest.mock('livereload', () => ({ createServer: jest.fn() }));
jest.mock('webpack', () => ({ __esModule: true, default: 'webpack' }));
jest.mock('../core/run.js', () => ({ run: jest.fn() }));
jest.mock('../error-handler.js', () => ({ errorHandler: jest.fn() }));

interface CompileResult {
  conf: InternalCompilerConf;
  webpackConfig: { name: string };
}

const lrServer = { config: { port: 35729 }, refresh: jest.fn() };

const result = (compilerName: string, overrides: Partial<InternalCompilerConf> = {}): Promise<CompileResult> =>
  Promise.resolve({
    conf: { compilerName, dist: 'dist/index.js', src: 'src/index.ts', ...overrides },
    webpackConfig: { name: compilerName },
  });

describe('isomorphicCompiler', () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockProcessExit();
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
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
      await expect(isomorphicCompiler(result('backendCompiler'))).rejects.toEqual(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith('isomorphicCompiler supported only frontendCompiler');
    });

    it('exits without a backend compiler', async () => {
      await expect(isomorphicCompiler(result('frontendCompiler'))).rejects.toEqual(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith('backendCompiler is required to set isomorphicCompiler');
    });

    it.each(['dist', 'src'] as const)('exits when a compiler has no %s', async (option) => {
      await expect(
        isomorphicCompiler(result('frontendCompiler'), result('backendCompiler', { [option]: undefined })),
      ).rejects.toEqual(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith(`You should set ${option} option to backendCompiler`);
    });

    it('ignores compilers that resolved to nothing', async () => {
      await expect(isomorphicCompiler(result('frontendCompiler'), Promise.resolve())).rejects.toEqual(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith('backendCompiler is required to set isomorphicCompiler');
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
