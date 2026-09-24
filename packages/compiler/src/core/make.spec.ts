import type { Configuration } from 'webpack';

import { getMode, getRootRequireDir, readPackageJson } from '@rockpack/utils';

import type { InternalCompilerConf } from '../types.js';
import type { CompileContext } from './compile-context.js';

import { makeModules } from '../modules/make-modules.js';
import { makeOutput } from '../modules/make-output.js';
import { makePlugins } from '../modules/make-plugins.js';
import { compileWebpackConfig } from '../utils/compile-webpack-config.js';
import { make } from './make.js';

const ISOMORPHIC_CONTEXT: CompileContext = { configOnly: true, isomorphic: true };
const STANDALONE_CONTEXT: CompileContext = { configOnly: false, isomorphic: false };

jest.mock('@rockpack/utils', () => ({
  ...jest.requireActual<Record<string, unknown>>('@rockpack/utils'),
  getMode: jest.fn(),
  getRootRequireDir: jest.fn(),
  readPackageJson: jest.fn(),
}));
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

const getModeMock = getMode as jest.MockedFunction<typeof getMode>;
const readPackageJsonMock = readPackageJson as jest.MockedFunction<typeof readPackageJson>;
const makeOutputMock = makeOutput as jest.MockedFunction<typeof makeOutput>;
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
    readPackageJsonMock.mockReturnValue(undefined);
    makeOutputMock.mockReturnValue({
      clean: true,
      filename: '[name].js',
      path: '/project/dist',
      pathinfo: true,
      publicPath: '/',
    });
    compileMock.mockImplementation(
      (config) => ({ ...config, compiled: true }) as ReturnType<typeof compileWebpackConfig>,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('uses an empty package.json when the project has none', async () => {
      await make(createConf(), null, STANDALONE_CONTEXT);

      expect(readPackageJsonMock).toHaveBeenCalledWith('/project');
      expect(makeModules).toHaveBeenCalledWith(expect.anything(), '/project', {}, 'production');
    });

    it('does not name the config without a string name', async () => {
      await make(createConf({ name: 42 as unknown as string }), null, STANDALONE_CONTEXT);

      expect(finalConfig()).not.toHaveProperty('name');
    });

    it('adds no node target or externals presets for a browser build', async () => {
      await make(createConf(), null, STANDALONE_CONTEXT);

      expect(finalConfig()).not.toHaveProperty('target');
      expect(finalConfig()).not.toHaveProperty('externalsPresets');
    });

    it('does not call a null post hook', async () => {
      await expect(make(createConf(), null, STANDALONE_CONTEXT)).resolves.toBeDefined();
    });
  });

  describe('positive cases', () => {
    it('reads package.json from the project root', async () => {
      readPackageJsonMock.mockReturnValue({ name: 'app' });

      await make(createConf(), null, STANDALONE_CONTEXT);

      expect(makePlugins).toHaveBeenCalledWith(
        expect.anything(),
        '/project',
        { name: 'app' },
        'production',
        'webpack',
        '/project/src',
        STANDALONE_CONTEXT,
      );
    });

    it('assembles the production config from the modules', async () => {
      const conf = createConf();
      const result = await make(conf, null, STANDALONE_CONTEXT);

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
      expect(compileMock).toHaveBeenCalledWith(expect.anything(), conf, 'production', '/project', 'modules', 'plugins');
      expect(result.conf).toBe(conf);
      expect(result.webpackConfig).toMatchObject({ compiled: true });
    });

    it('creates the output object in production when makeOutput returns none', async () => {
      makeOutputMock.mockReturnValue(undefined as unknown as ReturnType<typeof makeOutput>);

      await make(createConf(), null, STANDALONE_CONTEXT);

      expect(finalConfig()['output']).toEqual({ pathinfo: false });
    });

    it('watches with cache and no performance hints in development', async () => {
      getModeMock.mockReturnValue('development');

      await make(createConf(), null, STANDALONE_CONTEXT);

      expect(finalConfig()).toMatchObject({
        cache: true,
        mode: 'development',
        performance: { hints: false },
        watch: true,
      });
    });

    it('names the config and overrides the externals', async () => {
      await make(createConf({ externals: ['react'], name: 'client' }), null, STANDALONE_CONTEXT);

      expect(finalConfig()).toMatchObject({ externals: ['react'], name: 'client' });
    });

    it('targets node for a nodejs build', async () => {
      await make(createConf({ nodejs: true }), null, STANDALONE_CONTEXT);

      expect(finalConfig()).toMatchObject({ externalsPresets: { node: true }, target: 'node' });
    });

    it('adds node externals presets to isomorphic builds', async () => {
      await make(createConf(), null, ISOMORPHIC_CONTEXT);

      expect(finalConfig()).toMatchObject({ externalsPresets: { node: true } });
      expect(finalConfig()).not.toHaveProperty('target');
    });

    it('lets the post hook change the config before it is compiled', async () => {
      const post = jest.fn((config: Configuration) => {
        Object.assign(config, { custom: true });
      });

      await make(createConf(), post, STANDALONE_CONTEXT);

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
