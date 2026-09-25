import type webpack from 'webpack';

import { existsSync } from 'node:fs';
import path from 'node:path';

import type * as PluginMocks from '../__fixtures__/plugin-mocks.js';
import type { CompileContext } from '../core/compile-context.js';
import type { InternalCompilerConf, Mode, PackageJson } from '../types.js';

import { getPluginOptions } from '../__fixtures__/plugin-mocks.js';
import { fpPromise } from '../utils/find-free-port.js';
import { pathToEslintrc } from '../utils/path-to-eslintrc.js';
import { pathToStylelint } from '../utils/path-to-stylelint.js';
import { pathToTsConf } from '../utils/path-to-ts-conf.js';
import { makeBanner } from './make-banner.js';
import { makePlugins } from './make-plugins.js';

jest.mock('@nuxt/friendly-errors-webpack-plugin', () =>
  jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js').createPluginMock('FriendlyErrors'),
);
jest.mock('case-sensitive-paths-webpack-plugin', () =>
  jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js').createPluginMock('CaseSensitivePaths'),
);
jest.mock('copy-webpack-plugin', () =>
  jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js').createPluginMock('Copy'),
);
jest.mock('dotenv-webpack', () =>
  jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js').createPluginMock('Dotenv'),
);
jest.mock('eslint-webpack-plugin', () =>
  jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js').createPluginMock('Eslint'),
);
jest.mock('fork-ts-checker-webpack-plugin', () =>
  jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js').createPluginMock('ForkTsChecker'),
);
jest.mock('html-webpack-plugin', () =>
  jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js').createPluginMock('Html'),
);
jest.mock('mini-css-extract-plugin', () =>
  jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js').createPluginMock('MiniCssExtract'),
);
jest.mock('nodemon-webpack-plugin', () =>
  jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js').createPluginMock('Nodemon'),
);
jest.mock('stylelint-webpack-plugin', () =>
  jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js').createPluginMock('Stylelint'),
);
jest.mock('webpack/lib/FlagDependencyUsagePlugin.js', () =>
  jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js').createPluginMock('FlagDependencyUsage'),
);
jest.mock('webpack/lib/optimize/FlagIncludedChunksPlugin.js', () =>
  jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js').createPluginMock('FlagIncludedChunks'),
);
jest.mock('../plugins/ssr-development/index.js', () => ({
  SsrDevelopment: jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js').createPluginMock('Ssr'),
}));
jest.mock('node:fs', () => ({ existsSync: jest.fn() }));
jest.mock('../utils/find-free-port.js', () => ({ fpPromise: jest.fn() }));
jest.mock('../utils/path-to-eslintrc.js', () => ({ pathToEslintrc: jest.fn() }));
jest.mock('../utils/path-to-stylelint.js', () => ({ pathToStylelint: jest.fn() }));
jest.mock('../utils/path-to-ts-conf.js', () => ({ pathToTsConf: jest.fn() }));
jest.mock('./make-banner.js', () => ({ makeBanner: jest.fn() }));
jest.mock('../utils/package-root.js', () => ({ compilerRoot: (): string => '/compiler' }));

const { createPluginMock } = jest.requireActual<typeof PluginMocks>('../__fixtures__/plugin-mocks.js');

const fakeWebpack = {
  BannerPlugin: createPluginMock('Banner'),
  DefinePlugin: createPluginMock('Define'),
  NoEmitOnErrorsPlugin: createPluginMock('NoEmitOnErrors'),
  optimize: { SideEffectsFlagPlugin: createPluginMock('SideEffectsFlag') },
  WatchIgnorePlugin: createPluginMock('WatchIgnore'),
} as unknown as typeof webpack;

const existsSyncMock = existsSync as jest.MockedFunction<typeof existsSync>;
const fpPromiseMock = fpPromise as jest.MockedFunction<typeof fpPromise>;
const pathToEslintrcMock = pathToEslintrc as jest.MockedFunction<typeof pathToEslintrc>;
const pathToStylelintMock = pathToStylelint as jest.MockedFunction<typeof pathToStylelint>;
const pathToTsConfMock = pathToTsConf as jest.MockedFunction<typeof pathToTsConf>;
const makeBannerMock = makeBanner as jest.MockedFunction<typeof makeBanner>;

const root = '/project';
const defaultTemplate = path.join('/compiler', 'index.ejs');

type ConfOverrides = { [K in keyof InternalCompilerConf]?: InternalCompilerConf[K] | undefined };

const createConf = (overrides: ConfOverrides = {}): InternalCompilerConf =>
  ({
    dist: 'dist/index.js',
    messages: [],
    src: 'src/index.ts',
    ...overrides,
  }) as InternalCompilerConf;

const STANDALONE_CONTEXT: CompileContext = { configOnly: false, isomorphic: false };
const ISOMORPHIC_CONTEXT: CompileContext = { configOnly: true, isomorphic: true };

const build = async (
  overrides: ConfOverrides = {},
  mode: Mode = 'production',
  packageJson: PackageJson = { name: 'my_app' },
  compileContext: CompileContext = STANDALONE_CONTEXT,
): Promise<Record<string, unknown>> =>
  (await makePlugins(createConf(overrides), root, packageJson, mode, fakeWebpack, '/project/src', compileContext)).dict;

const mockFiles = (...files: string[]): void => {
  existsSyncMock.mockImplementation((file) => files.map((name) => path.resolve(root, name)).includes(String(file)));
};

describe('makePlugins', () => {
  beforeEach(() => {
    mockFiles();
    fpPromiseMock.mockImplementation((port) => Promise.resolve(port + 1));
    pathToEslintrcMock.mockReturnValue(false);
    pathToStylelintMock.mockReturnValue(false);
    pathToTsConfMock.mockReturnValue(false);
    makeBannerMock.mockReturnValue(false);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('skips the type checker without a tsconfig', async () => {
      expect(await build()).not.toHaveProperty('ForkTsCheckerPlugin');
    });

    it('skips dotenv without .env and .env.defaults', async () => {
      mockFiles('.env.example');

      expect(await build()).not.toHaveProperty('Dotenv');
    });

    it('skips the banner when there is none or it is disabled', async () => {
      expect(await build()).not.toHaveProperty('BannerPlugin');

      makeBannerMock.mockReturnValue('from file');

      expect(await build({ banner: false })).not.toHaveProperty('BannerPlugin');
    });

    it('skips html pages when html is false or the build is isomorphic', async () => {
      expect(await build({ html: false })).not.toHaveProperty('HtmlWebpackPlugin0');
      expect(await build({ html: true }, 'production', undefined, ISOMORPHIC_CONTEXT)).not.toHaveProperty(
        'HtmlWebpackPlugin0',
      );
    });

    it('does not lint without the lint option even when configs exist', async () => {
      pathToStylelintMock.mockReturnValue('/project/.stylelintrc');
      pathToEslintrcMock.mockReturnValue('/project/eslint.config.js');

      const dict = await build();

      expect(dict).not.toHaveProperty('StylelintWebpackPlugin');
      expect(dict).not.toHaveProperty('EslintWebpackPlugin');
    });

    it('skips linters without configs and eslint in debug mode', async () => {
      expect(await build({ lint: true })).not.toHaveProperty('StylelintWebpackPlugin');

      pathToEslintrcMock.mockReturnValue('/project/eslint.config.js');

      expect(await build({ debug: true, lint: true })).not.toHaveProperty('EslintWebpackPlugin');
    });

    it('skips copying for an object without from/to or files', async () => {
      expect(await build({ copy: {} as InternalCompilerConf['copy'] })).not.toHaveProperty('CopyWebpackPlugin');
    });

    it('does not run nodemon for a library or a non-node build in development', async () => {
      const library = await build({ __library: true, nodejs: true }, 'development');
      const frontend = await build({}, 'development');

      [library, frontend].forEach((dict) => {
        expect(dict).not.toHaveProperty('NodemonPlugin');
        expect(dict).not.toHaveProperty('SSRDevelopment');
      });
    });
  });

  describe('positive cases', () => {
    it('keeps the plugin order of a full production build', async () => {
      pathToTsConfMock.mockReturnValue('/project/tsconfig.json');
      pathToStylelintMock.mockReturnValue('/project/.stylelintrc');
      pathToEslintrcMock.mockReturnValue('/project/eslint.config.js');
      makeBannerMock.mockReturnValue('banner');
      mockFiles('.env');

      expect(Object.keys(await build({ copy: { from: 'a', to: 'b' }, lint: true }))).toEqual([
        'FriendlyErrorsPlugin',
        'ForkTsCheckerPlugin',
        'Dotenv',
        'BannerPlugin',
        'HtmlWebpackPlugin0',
        'StylelintWebpackPlugin',
        'EslintWebpackPlugin',
        'DefinePlugin',
        'CopyWebpackPlugin',
        'CaseSensitivePathsPlugin',
        'MiniCssExtractPlugin',
        'FlagDependencyUsagePlugin',
        'FlagIncludedChunksPlugin',
        'NoEmitOnErrorsPlugin',
        'SideEffectsFlagPlugin',
      ]);
    });

    it('keeps the plugin order of a node development build', async () => {
      expect(
        Object.keys(await build({ __isIsomorphicStyles: true, html: false, nodejs: true }, 'development')),
      ).toEqual(['FriendlyErrorsPlugin', 'DefinePlugin', 'NodemonPlugin', 'WatchIgnorePlugin', 'MiniCssExtractPlugin']);
    });

    it('always reports errors with the compilation messages', async () => {
      expect(getPluginOptions((await build({ messages: ['ready'] }))['FriendlyErrorsPlugin'])).toEqual({
        clearConsole: false,
        compilationSuccessInfo: { messages: ['ready'] },
      });
    });

    it('checks types for a TypeScript project', async () => {
      pathToTsConfMock.mockReturnValue('/project/tsconfig.json');

      expect(await build()).toHaveProperty('ForkTsCheckerPlugin');
      expect(pathToTsConfMock).toHaveBeenCalledWith(root, 'production', false);
    });

    it('loads .env with safe and defaults flags', async () => {
      mockFiles('.env', '.env.example', '.env.defaults');

      expect(getPluginOptions((await build())['Dotenv'])).toEqual({
        allowEmptyValues: true,
        defaults: true,
        path: path.resolve(root, '.env'),
        safe: true,
        silent: false,
      });
    });

    it('loads .env.defaults alone without warning about the missing .env', async () => {
      mockFiles('.env.defaults');

      expect(getPluginOptions((await build())['Dotenv'])).toMatchObject({ defaults: true, silent: true });
    });

    it('loads .env without example and defaults files', async () => {
      mockFiles('.env');

      expect(getPluginOptions((await build())['Dotenv'])).toMatchObject({ defaults: false, safe: false });
    });

    it.each<[string, InternalCompilerConf['banner'], string]>([
      ['a custom banner string', 'custom banner', 'custom banner'],
      ['banner true with the package banner', true, 'from file'],
      ['an undefined banner with the package banner', undefined, 'from file'],
    ])('adds %s', async (_name, banner, expected) => {
      makeBannerMock.mockReturnValue('from file');

      expect(getPluginOptions((await build({ banner }))['BannerPlugin'])).toEqual({
        banner: expected,
        entryOnly: true,
      });
    });

    it('renders the default page from the bundled template with the package title', async () => {
      expect(getPluginOptions((await build({}, 'production', { name: 'my_app' }))['HtmlWebpackPlugin0'])).toEqual({
        code: null,
        filename: 'index.html',
        inject: false,
        minify: { collapseWhitespace: true },
        template: defaultTemplate,
        templateParameters: { version: '1.0.0' },
        title: 'my app',
      });
    });

    it('uses an empty title without a package name and keeps whitespace in development', async () => {
      const page = getPluginOptions((await build({}, 'development', {}))['HtmlWebpackPlugin0']);

      expect(page).toMatchObject({ minify: { collapseWhitespace: false }, title: '' });
    });

    it('renders a single configured page with the version and a filename from the template', async () => {
      const page = getPluginOptions(
        (
          await build({
            html: { code: '<div />', favicon: 'icon.png', template: '/project/public/app.ejs', title: 'App' },
            version: '2.0.0',
          })
        )['HtmlWebpackPlugin0'],
      );

      expect(page).toMatchObject({
        code: '<div />',
        favicon: 'icon.png',
        filename: 'app.html',
        template: '/project/public/app.ejs',
        templateParameters: { version: '2.0.0' },
        title: 'App',
      });
    });

    it('keeps an explicit page filename', async () => {
      const page = getPluginOptions((await build({ html: { filename: 'main.html' } }))['HtmlWebpackPlugin0']);

      expect(page).toMatchObject({ filename: 'main.html', template: defaultTemplate });
    });

    it('renders every page of an html array', async () => {
      const dict = await build({ html: [{ template: '/project/a.ejs' }, { filename: 'b.html' }] });

      expect(getPluginOptions(dict['HtmlWebpackPlugin0'])).toMatchObject({ filename: 'a.html' });
      expect(getPluginOptions(dict['HtmlWebpackPlugin1'])).toMatchObject({
        filename: 'b.html',
        template: defaultTemplate,
      });
    });

    it('lints styles and scripts with the lint option when configs exist', async () => {
      pathToStylelintMock.mockReturnValue('/project/.stylelintrc');
      pathToEslintrcMock.mockReturnValue('/project/eslint.config.js');

      const dict = await build({ lint: true });

      expect(getPluginOptions(dict['StylelintWebpackPlugin'])).toEqual({
        configFile: '/project/.stylelintrc',
        context: '/project/src',
      });
      expect(getPluginOptions(dict['EslintWebpackPlugin'])).toEqual({
        context: '/project/src',
        eslintPath: expect.stringContaining('eslint') as unknown,
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
        failOnError: true,
      });
    });

    it('defines NODE_ENV and the global variables', async () => {
      expect(getPluginOptions((await build({ global: { API: 'https://api' } }))['DefinePlugin'])).toEqual({
        'process.env.API': '"https://api"',
        'process.env.NODE_ENV': '"production"',
      });
    });

    it('defines ROOT_DIRNAME for a backend and the live reload port', async () => {
      const context: CompileContext = {
        ...ISOMORPHIC_CONTEXT,
        liveReload: { port: 35729, server: { refresh: jest.fn() } },
      };

      expect(
        getPluginOptions((await build({ __isBackend: true }, 'development', undefined, context))['DefinePlugin']),
      ).toEqual({
        'process.env.LIVE_RELOAD_PORT': '"35729"',
        'process.env.NODE_ENV': '"development"',
        'process.env.ROOT_DIRNAME': '"/project"',
      });
    });

    it.each<[string, InternalCompilerConf['copy'], unknown]>([
      ['a single from/to pair', { from: 'a', to: 'b' }, { options: {}, patterns: [{ from: 'a', to: 'b' }] }],
      [
        'files with options',
        { files: [{ from: 'a', to: 'b' }], opts: { concurrency: 1 } },
        { options: { concurrency: 1 }, patterns: [{ from: 'a', to: 'b' }] },
      ],
      [
        'files without options',
        { files: [{ from: 'a', to: 'b' }] },
        { options: {}, patterns: [{ from: 'a', to: 'b' }] },
      ],
      ['an array of pairs', [{ from: 'a', to: 'b' }], { options: {}, patterns: [{ from: 'a', to: 'b' }] }],
    ])('copies %s', async (_name, copy, expected) => {
      expect(getPluginOptions((await build({ copy }))['CopyWebpackPlugin'])).toEqual(expected);
    });

    it('runs nodemon with a free inspect port for a node build in development', async () => {
      const conf = createConf({ dist: 'build/server.js', nodejs: true });

      const { dict } = await makePlugins(
        conf,
        root,
        {},
        'development',
        fakeWebpack,
        '/project/src',
        STANDALONE_CONTEXT,
      );

      expect(fpPromiseMock).toHaveBeenCalledWith(9224);
      expect(getPluginOptions(dict['NodemonPlugin'])).toEqual({
        ext: 'js',
        ignore: ['*.map', '*.hot-update.json', '*.hot-update.js', 'stats.json'],
        nodeArgs: ['--inspect=9225', '--require="source-map-support/register"'],
        quiet: true,
        script: path.resolve(root, 'build/server.js'),
        verbose: false,
        watch: [path.resolve(root, 'build')],
      });
      expect(conf.messages).toEqual(['nodemon is running', 'node-inspect is available on 9225 port']);
    });

    it('runs the ssr development plugin for an isomorphic backend without the inspect message', async () => {
      const conf = createConf({ __isIsomorphicBackend: true, dist: '/abs/server.js' });

      const { dict } = await makePlugins(
        conf,
        root,
        {},
        'development',
        fakeWebpack,
        '/project/src',
        ISOMORPHIC_CONTEXT,
      );

      const inspectPort = fpPromiseMock.mock.calls[0]?.[0] ?? 0;
      expect(inspectPort).toBeGreaterThanOrEqual(9000);
      expect(inspectPort).toBeLessThanOrEqual(9999);
      expect(getPluginOptions(dict['SSRDevelopment'])).toMatchObject({ script: '/abs/server.js', watch: ['/abs'] });
      expect(conf.messages).toEqual(['nodemon is running']);
    });

    it('ignores css typings while watching and extracts isomorphic styles in development', async () => {
      const dict = await build({ __isIsomorphicStyles: true }, 'development');

      expect(getPluginOptions(dict['WatchIgnorePlugin'])).toEqual({ paths: [/css\.d\.ts$/] });
      expect(getPluginOptions(dict['MiniCssExtractPlugin'])).toEqual({ filename: 'css/styles.css' });
      expect(dict).not.toHaveProperty('CaseSensitivePathsPlugin');
    });

    it('adds the production optimisation plugins', async () => {
      const dict = await build();

      expect(Object.keys(dict)).toEqual(
        expect.arrayContaining([
          'CaseSensitivePathsPlugin',
          'MiniCssExtractPlugin',
          'FlagDependencyUsagePlugin',
          'FlagIncludedChunksPlugin',
          'NoEmitOnErrorsPlugin',
          'SideEffectsFlagPlugin',
        ]),
      );
      expect(dict).not.toHaveProperty('WatchIgnorePlugin');
    });

    it.each<[InternalCompilerConf['styles'], string]>([
      ['assets/main.css', 'assets/main.css'],
      ['assets/main', 'css/styles.css'],
      [undefined, 'css/styles.css'],
    ])('names the extracted styles for styles=%p', async (styles, filename) => {
      expect(getPluginOptions((await build({ styles }))['MiniCssExtractPlugin'])).toEqual({ filename });
    });
  });
});
