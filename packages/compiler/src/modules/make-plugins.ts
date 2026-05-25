import type webpack from 'webpack';

import FriendlyErrorsWebpackPlugin from '@nuxt/friendly-errors-webpack-plugin';
import StatoscopeWebpackPlugin from '@statoscope/webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import EslintWebpackPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import NodemonPlugin from 'nodemon-webpack-plugin';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';
import { isArray, isBoolean, isObject, isString } from 'valid-types';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import FlagDependencyUsagePlugin from 'webpack/lib/FlagDependencyUsagePlugin.js';
import FlagIncludedChunksPlugin from 'webpack/lib/optimize/FlagIncludedChunksPlugin.js';

import type { HtmlPage, InternalCompilerConf, Mode, PackageJson } from '../types.js';

import { SsrDevelopment } from '../plugins/ssr-development/index.js';
import { Collection } from '../utils/collection.js';
import { fpPromise } from '../utils/find-free-port.js';
import { getRandomInt, getTitle } from '../utils/other.js';
import { pathToEslintrc } from '../utils/path-to-eslintrc.js';
import { pathToStylelint } from '../utils/path-to-stylelint.js';
import { pathToTsConf } from '../utils/path-to-ts-conf.js';
import { makeBanner } from './make-banner.js';
import { makeResolve } from './make-resolve.js';

const _require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface NodemonOptions {
  [key: string]: unknown;
  ext: string;
  ignore: string[];
  nodeArgs: string[];
  quiet: boolean;
  script: string;
  verbose: boolean;
  watch: string;
}

const getNodemonOptions = async (
  distFolder: string,
  distPath: string,
  conf: InternalCompilerConf,
): Promise<NodemonOptions> => {
  const defaultInspectPort = global.ISOMORPHIC ? getRandomInt(9000, 9999) : 9224;
  const freeInspectPort = await fpPromise(defaultInspectPort);
  const script = path.join(distFolder, path.basename(distPath));

  const opts: NodemonOptions = {
    ext: 'js',
    ignore: ['*.map', '*.hot-update.json', '*.hot-update.js', 'stats.json'],
    nodeArgs: [`--inspect=${freeInspectPort}`, '--require="source-map-support/register"'],
    quiet: true,
    script,
    verbose: false,
    watch: distFolder,
  };

  conf.messages?.push('nodemon is running');

  if (!conf.__isIsomorphicBackend) {
    conf.messages?.push(`node-inspect is available on ${freeInspectPort} port`);
  }

  return opts;
};

type WebpackModule = typeof webpack;

/* eslint-disable @sonar/cognitive-complexity */
const getPlugins = async (
  conf: InternalCompilerConf,
  mode: Mode,
  root: string,
  packageJson: PackageJson,
  wp: WebpackModule,
  context: string,
): Promise<Record<string, unknown>> => {
  const tsConfig = pathToTsConf(root, mode, false);
  const { extensions } = makeResolve(root);
  const distPath = path.isAbsolute(conf.dist) ? conf.dist : path.resolve(root, conf.dist);
  const distFolder = path.dirname(distPath);
  const isTypeScript = isString(tsConfig);

  const plugins: Record<string, unknown> = {};

  plugins['FriendlyErrorsPlugin'] = new FriendlyErrorsWebpackPlugin({
    clearConsole: false,
    compilationSuccessInfo: { messages: conf.messages ?? [] },
  });

  if (isTypeScript) {
    plugins['ForkTsCheckerPlugin'] = new ForkTsCheckerWebpackPlugin();
  }

  if (existsSync(path.resolve(root, '.env'))) {
    const isExample = existsSync(path.resolve(root, '.env.example'));
    const isDefaults = existsSync(path.resolve(root, '.env.defaults'));
    const dotenv = new Dotenv({
      allowEmptyValues: true,
      defaults: isDefaults,
      path: path.resolve(root, '.env'),
      safe: isExample,
    });
    const dotenvAny = dotenv as unknown as Record<string, unknown>;
    if (dotenvAny['definitions'] && (dotenvAny['definitions'] as Record<string, unknown>)['process.env']) {
      delete (dotenvAny['definitions'] as Record<string, unknown>)['process.env'];
    }
    plugins['Dotenv'] = dotenv;
  }

  let banner: false | string = makeBanner(packageJson);

  if (conf.banner) {
    if (isString(conf.banner)) {
      banner = conf.banner;
    }
  } else if (isBoolean(conf.banner) && conf.banner === false) {
    banner = false;
  }

  conf.banner = banner;

  if (conf.banner) {
    plugins['BannerPlugin'] = new wp.BannerPlugin({
      banner: banner ? banner : '',
      entryOnly: true,
    });
  }

  let HTMLProcessing = !(typeof conf.html !== 'undefined' && isBoolean(conf.html) && conf.html === false);

  if (global.ISOMORPHIC) {
    HTMLProcessing = false;
  }

  if (HTMLProcessing) {
    let pages: HtmlPage[];

    if (conf.html && isArray(conf.html)) {
      pages = conf.html;
    } else {
      pages = [
        {
          code: conf.html && !isBoolean(conf.html) && conf.html.code ? conf.html.code : null,
          favicon: conf.html && !isBoolean(conf.html) && conf.html.favicon ? conf.html.favicon : null,
          filename: conf.html && !isBoolean(conf.html) && conf.html.filename ? conf.html.filename : false,
          template:
            (conf.html && !isBoolean(conf.html) && conf.html.template) ||
            path.resolve(__dirname, '../../..', './index.ejs'),
          title:
            (conf.html && !isBoolean(conf.html) && conf.html.title) ||
            (getTitle(packageJson) ? String(getTitle(packageJson)) : ''),
        },
      ];
    }

    pages = pages.map((page) => {
      if (!page.template) {
        page.template = path.resolve(__dirname, '../../..', './index.ejs');
      }

      page.templateParameters = {
        version: typeof conf.version === 'string' ? conf.version : '1.0.0',
      };

      if (!page.filename) {
        page.filename =
          page.template.slice(page.template.lastIndexOf(path.sep) + 1, page.template.lastIndexOf('.')) + '.html';
      }

      page.inject = false;
      page.minify = { collapseWhitespace: mode === 'production' };

      return page;
    });

    pages.forEach((page, index) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      plugins[`HtmlWebpackPlugin${index}`] = new HtmlWebpackPlugin(page as any);
    });
  }

  const eslintRc = pathToEslintrc(root, mode);
  const stylelint = pathToStylelint(root);

  if (stylelint) {
    plugins['StylelintWebpackPlugin'] = new StylelintWebpackPlugin({ configFile: stylelint });
  }

  if (isString(eslintRc)) {
    plugins['EslintWebpackPlugin'] = new EslintWebpackPlugin({
      context,
      eslintPath: _require.resolve('eslint'),
      extensions,
      failOnError: mode === 'production' && !conf.debug,
    });
  }

  const env = conf.global ?? {};

  if (conf.__isBackend) {
    env['ROOT_DIRNAME'] = root;
  }
  if (typeof global.LIVE_RELOAD_PORT === 'number') {
    env['LIVE_RELOAD_PORT'] = String(global.LIVE_RELOAD_PORT);
  }

  const definePluginOpts: Record<string, string> = {
    'process.env.NODE_ENV': JSON.stringify(mode),
    ...Object.keys(env).reduce<Record<string, string>>((prev, curr) => {
      prev[`process.env.${curr}`] = JSON.stringify(env[curr]);

      return prev;
    }, {}),
  };

  plugins['DefinePlugin'] = new wp.DefinePlugin(definePluginOpts);

  if (conf.copy) {
    let _prop: null | unknown[] = null;
    let _opts: Record<string, unknown> = {};

    if (isObject(conf.copy)) {
      const copy = conf.copy as Record<string, unknown>;
      if (copy['from'] && copy['to']) {
        _prop = [conf.copy];
      } else if (copy['files']) {
        _prop = copy['files'] as unknown[];
        _opts = (copy['opts'] as Record<string, unknown>) ?? {};
      }
    } else if (isArray(conf.copy)) {
      _prop = conf.copy;
    }

    if (_prop) {
      plugins['CopyWebpackPlugin'] = new CopyWebpackPlugin({
        options: _opts,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
        patterns: _prop as any,
      });
    }
  }

  if (mode === 'development') {
    if (!conf.__library && conf.nodejs && !global.ISOMORPHIC) {
      const opts = await getNodemonOptions(distFolder, distPath, conf);
      plugins['NodemonPlugin'] = new NodemonPlugin(opts);
    } else if (global.ISOMORPHIC && conf.__isIsomorphicBackend) {
      const opts = await getNodemonOptions(distFolder, distPath, conf);
      plugins['SSRDevelopment'] = new SsrDevelopment(opts);
    }

    plugins['WatchIgnorePlugin'] = new wp.WatchIgnorePlugin({ paths: [/css\.d\.ts$/] });

    if (conf.__isIsomorphicStyles) {
      plugins['MiniCssExtractPlugin'] = new MiniCssExtractPlugin({ filename: 'css/styles.css' });
    }
  }

  if (mode === 'production') {
    plugins['CaseSensitivePathsPlugin'] = new CaseSensitivePathsPlugin();

    const styleName =
      conf.styles && typeof conf.styles === 'string' && conf.styles.indexOf('.css') >= 0
        ? conf.styles
        : 'css/styles.css';

    plugins['MiniCssExtractPlugin'] = new MiniCssExtractPlugin({ filename: styleName });
    plugins['FlagDependencyUsagePlugin'] = new FlagDependencyUsagePlugin();
    plugins['FlagIncludedChunksPlugin'] = new FlagIncludedChunksPlugin();
    plugins['NoEmitOnErrorsPlugin'] = new wp.NoEmitOnErrorsPlugin();
    plugins['SideEffectsFlagPlugin'] = new wp.optimize.SideEffectsFlagPlugin();
  }

  if (conf.analyzer) {
    const analyzerPort = await fpPromise(8888);

    plugins['BundleAnalyzerPlugin'] = new BundleAnalyzerPlugin(
      mode === 'development'
        ? { analyzerPort }
        : { analyzerMode: 'static', openAnalyzer: false, reportFilename: 'webpack-report.html' },
    );

    plugins['StatoscopeWebpackPlugin'] = new StatoscopeWebpackPlugin({ watchMode: mode === 'development' });
  }

  return plugins;
};
/* eslint-enable @sonar/cognitive-complexity */

export const makePlugins = async (
  conf: InternalCompilerConf,
  root: string,
  packageJson: PackageJson,
  mode: Mode,
  wp: WebpackModule,
  context: string,
): Promise<Collection> => {
  const plugins = await getPlugins(conf, mode, root, packageJson, wp, context);

  return new Collection({ data: plugins, props: {} });
};
