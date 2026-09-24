import type { Configuration } from 'webpack';

import { getMode, getRootRequireDir } from '@rockpack/utils';
import { existsSync, readFileSync } from 'node:fs';

import type { InternalCompilerConf } from '../types.js';

import { makeModules } from '../modules/make-modules.js';
import { makeOutput } from '../modules/make-output.js';
import { makePlugins } from '../modules/make-plugins.js';
import { compileWebpackConfig } from '../utils/compile-webpack-config.js';
import { mergeConfWithDefault } from '../utils/merge-conf-with-default.js';
import { make } from './make.js';

jest.mock('@rockpack/utils', () => ({ getMode: jest.fn(), getRootRequireDir: jest.fn() }));
jest.mock('node:fs', () => ({ existsSync: jest.fn(), readFileSync: jest.fn() }));
jest.mock('webpack', () => ({ __esModule: true, default: 'webpack' }));
jest.mock('../modules/make-dev-server.js', () => ({ makeDevServer: jest.fn(() => Promise.resolve('devServer')) }));
jest.mock('../modules/make-devtool.js', () => ({ makeDevtool: jest.fn(() => 'devtool') }));
jest.mock('../modules/make-entry.js', () => ({
  makeEntry: jest.fn(() => ({ context: '/project/src', entry: { index: '/project/src/index.ts' } })),
}));
jest.mock('../modules/make-externals.js', () => ({ makeExternals: jest.fn(() => 'externals') }));
jest.mock('../modules/make-modules.js', () => ({ makeModules: jest.fn(() => 'modules') }));
jest.mock('../modules/make-optimization.js', () => ({ makeOptimization: jest.fn(() => 'optimization') }));
jest.mock('../modules/make-output.js', () => ({ makeOutput: jest.fn() }));
jest.mock('../modules/make-plugins.js', () => ({ makePlugins: jest.fn(() => Promise.resolve('plugins')) }));
jest.mock('../modules/make-resolve.js', () => ({ makeResolve: jest.fn(() => 'resolve') }));
jest.mock('../modules/make-stats.js', () => ({ makeStats: jest.fn(() => 'stats') }));
jest.mock('../utils/compile-webpack-config.js', () => ({ compileWebpackConfig: jest.fn() }));
jest.mock('../utils/merge-conf-with-default.js', () => ({ mergeConfWithDefault: jest.fn() }));

const getModeMock = getMode as jest.MockedFunction<typeof getMode>;
const existsSyncMock = existsSync as jest.MockedFunction<typeof existsSync>;
const readFileSyncMock = readFileSync as unknown as jest.Mock<string>;
const makeOutputMock = makeOutput as jest.MockedFunction<typeof makeOutput>;
const mergeConfMock = mergeConfWithDefault as jest.MockedFunction<typeof mergeConfWithDefault>;
const compileMock = compileWebpackConfig as jest.MockedFunction<typeof compileWebpackConfig>;

const createConf = (overrides: Partial<InternalCompilerConf> = {}): InternalCompilerConf => ({
  dist: 'dist/index.js',
  src: 'src/index.ts',
  ...overrides,
});

const finalConfig = (): Record<string, unknown> => compileMock.mock.calls[0]?.[0] ?? {};

describe('make', () => {
  beforeEach(() => {
    getModeMock.mockReturnValue('production');
    (getRootRequireDir as jest.Mock).mockReturnValue('/project');
    existsSyncMock.mockReturnValue(false);
    makeOutputMock.mockReturnValue({
      clean: true,
      filename: '[name].js',
      path: '/project/dist',
      pathinfo: true,
      publicPath: '/',
    });
    mergeConfMock.mockImplementation((conf) => Promise.resolve({ ...conf, merged: true } as InternalCompilerConf));
    compileMock.mockImplementation(
      (config) => ({ ...config, compiled: true }) as ReturnType<typeof compileWebpackConfig>,
    );
  });

  afterEach(() => {
    global.ISOMORPHIC = undefined;
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('uses an empty package.json when the project has none', async () => {
      await make(createConf(), null);

      expect(readFileSyncMock).not.toHaveBeenCalled();
      expect(makeModules).toHaveBeenCalledWith(expect.anything(), '/project', {}, 'production');
    });

    it('does not name the config without a string name', async () => {
      await make(createConf({ name: 42 as unknown as string }), null);

      expect(finalConfig()).not.toHaveProperty('name');
    });

    it('adds no node target or externals presets for a browser build', async () => {
      await make(createConf(), null);

      expect(finalConfig()).not.toHaveProperty('target');
      expect(finalConfig()).not.toHaveProperty('externalsPresets');
    });

    it('does not call a null post hook', async () => {
      await expect(make(createConf(), null)).resolves.toBeDefined();
    });
  });

  describe('positive cases', () => {
    it('reads package.json from the project root', async () => {
      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue('{"name":"app"}');

      await make(createConf(), null);

      expect(makePlugins).toHaveBeenCalledWith(
        expect.anything(),
        '/project',
        { name: 'app' },
        'production',
        'webpack',
        '/project/src',
      );
    });

    it('assembles the production config from the modules', async () => {
      const result = await make(createConf(), null);

      expect(finalConfig()).toEqual({
        devServer: 'devServer',
        devtool: 'devtool',
        entry: { index: '/project/src/index.ts' },
        externals: 'externals',
        infrastructureLogging: { level: 'error' },
        mode: 'production',
        optimization: 'optimization',
        output: { clean: true, filename: '[name].js', path: '/project/dist', pathinfo: false, publicPath: '/' },
        performance: { hints: 'warning' },
        resolve: 'resolve',
        stats: 'stats',
      });
      expect(compileMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ merged: true }),
        'production',
        '/project',
        'modules',
        'plugins',
      );
      expect(result.conf).toMatchObject({ merged: true });
      expect(result.webpackConfig).toMatchObject({ compiled: true });
    });

    it('creates the output object in production when makeOutput returns none', async () => {
      makeOutputMock.mockReturnValue(undefined as unknown as ReturnType<typeof makeOutput>);

      await make(createConf(), null);

      expect(finalConfig()['output']).toEqual({ pathinfo: false });
    });

    it('watches with cache and no performance hints in development', async () => {
      getModeMock.mockReturnValue('development');

      await make(createConf(), null);

      expect(finalConfig()).toMatchObject({
        cache: true,
        mode: 'development',
        performance: { hints: false },
        watch: true,
      });
    });

    it('names the config and overrides the externals', async () => {
      await make(createConf({ externals: ['react'], name: 'client' }), null);

      expect(finalConfig()).toMatchObject({ externals: ['react'], name: 'client' });
    });

    it('targets node for a nodejs build', async () => {
      await make(createConf({ nodejs: true }), null);

      expect(finalConfig()).toMatchObject({ externalsPresets: { node: true }, target: 'node' });
    });

    it('adds node externals presets to isomorphic builds', async () => {
      global.ISOMORPHIC = true;

      await make(createConf(), null);

      expect(finalConfig()).toMatchObject({ externalsPresets: { node: true } });
      expect(finalConfig()).not.toHaveProperty('target');
    });

    it('lets the post hook change the config before it is compiled', async () => {
      const post = jest.fn((config: Configuration) => {
        Object.assign(config, { custom: true });
      });

      await make(createConf(), post);

      expect(post).toHaveBeenCalledWith(
        expect.objectContaining({ mode: 'production' }),
        'modules',
        'plugins',
        'production',
      );
      expect(finalConfig()['custom']).toBe(true);
    });
  });
});
