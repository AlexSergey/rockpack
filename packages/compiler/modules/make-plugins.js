const LoadablePlugin = require('@loadable/webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin');
const { existsSync } = require('node:fs');
const path = require('node:path');
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlInlineCssWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const HtmlInlineScriptWebpackPlugin = require('html-inline-script-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');
const { isArray, isBoolean, isObject, isString } = require('valid-types');
const VConsoleWebpackPlugin = require('vconsole-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const FlagDependencyUsagePlugin = require('webpack/lib/FlagDependencyUsagePlugin');
const FlagIncludedChunksPlugin = require('webpack/lib/optimize/FlagIncludedChunksPlugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const BreakingChangesWebpack4 = require('../plugins/BreakingChangesWebpack4');
const SSRDevelopment = require('../plugins/SSRDevelopment');
const WebViewHTMLWrapper = require('../plugins/WebViewHTMLWrapper');
const Collection = require('../utils/collection');
const fpPromise = require('../utils/find-free-port');
const { getRandomInt, getTitle } = require('../utils/other');
const pathToEslintrc = require('../utils/path-to-eslintrc');
const pathToStylelint = require('../utils/path-to-stylelint');
const pathToTSConf = require('../utils/path-to-ts-conf');
const makeBanner = require('./make-banner');
const makeResolve = require('./make-resolve');

const getNodemonOptions = async (distFolder, distPath, conf) => {
  const defaultInspectPort = global.ISOMORPHIC ? getRandomInt(9000, 9999) : 9224;
  const freeInspectPort = await fpPromise(defaultInspectPort);

  const script = path.join(distFolder, path.basename(distPath));

  const opts = {
    ext: 'js',
    ignore: ['*.map', '*.hot-update.json', '*.hot-update.js', 'stats.json'],
    nodeArgs: [`--inspect=${freeInspectPort}`, '--require="source-map-support/register"'],
    quiet: true,
    script,
    verbose: false,
    watch: distFolder,
  };

  conf.messages.push('nodemon is running');

  if (!conf.__isIsomorphicBackend) {
    conf.messages.push(`node-inspect is available on ${freeInspectPort} port`);
  }

  return opts;
};

const getPlugins = async (conf, mode, root, packageJson, webpack, context) => {
  const tsConfig = pathToTSConf(root, mode, false);
  const { extensions } = makeResolve(root);
  const distPath = path.isAbsolute(conf.dist) ? conf.dist : path.resolve(root, conf.dist);
  const distFolder = path.dirname(distPath);

  const isTypeScript = isString(tsConfig);

  const plugins = {};

  plugins.BreakingChangesWebpack4 = new BreakingChangesWebpack4();

  plugins.FriendlyErrorsPlugin = new FriendlyErrorsWebpackPlugin({
    clearConsole: false,
    compilationSuccessInfo: {
      messages: conf.messages,
    },
  });

  if (isTypeScript) {
    plugins.ForkTsCheckerPlugin = new ForkTsCheckerWebpackPlugin();
  }

  if (existsSync(path.resolve(root, '.env'))) {
    const isExample = existsSync(path.resolve(root, '.env.example'));
    const isDefaults = existsSync(path.resolve(root, '.env.defaults'));
    /**
     * dotenv-webpack 6.0 fix
     * {}.DEBUG = namespaces;
     * Error
     * */
    const dotenv = new Dotenv({
      allowEmptyValues: true,
      defaults: isDefaults,
      path: path.resolve(root, '.env'),
      safe: isExample,
    });
    if (dotenv.definitions && dotenv.definitions['process.env']) {
      delete dotenv.definitions['process.env'];
    }
    plugins.Dotenv = dotenv;
  }

  if (mode !== 'production' || conf.debug) {
    plugins.WriteFilePlugin = new WriteFilePlugin();
  }

  let banner = makeBanner(packageJson, root);

  if (conf.banner) {
    if (isString(conf.banner)) {
      banner = conf.banner;
    }
  } else if (isBoolean(conf.banner) && conf.banner === false) {
    banner = false;
  }

  conf.banner = banner;

  if (conf.banner) {
    plugins.BannerPlugin = new webpack.BannerPlugin({
      banner: !banner ? '' : banner,
      entryOnly: true,
    });
  }

  let pages = [];
  let HTMLProcessing = true;

  if (typeof conf.html !== 'undefined' && isBoolean(conf.html) && conf.html === false) {
    HTMLProcessing = false;
  }

  if (global.ISOMORPHIC) {
    HTMLProcessing = false;
  }

  if (HTMLProcessing) {
    if (conf.html && isArray(conf.html)) {
      pages = conf.html;
    } else {
      pages = [
        {
          code: conf.html && conf.html.code ? conf.html.code : null,
          favicon: conf.html && conf.html.favicon ? conf.html.favicon : null,

          filename: conf.html && conf.html.filename ? conf.html.filename : conf.webview ? 'index.html' : false,
          template:
            (conf.html && conf.html.template) ||
            (conf.webview
              ? path.resolve(__dirname, '..', './index.webview.ejs')
              : path.resolve(__dirname, '..', './index.ejs')),
          title: (conf.html && conf.html.title) || (getTitle(packageJson) ? getTitle(packageJson) : ''),
        },
      ];
    }

    pages = pages.map((page) => {
      if (!page.template) {
        page.template = conf.webview
          ? path.resolve(__dirname, '..', './index.webview.ejs')
          : path.resolve(__dirname, '..', './index.ejs');
      }
      if (!page.filename) {
        page.filename = page.template.slice(page.template.lastIndexOf(path.sep) + 1, page.template.lastIndexOf('.'));
        page.filename += '.html';
      }

      if (conf.webview) {
        page.cache = false;
        page.inject = 'body';
      } else {
        page.inject = false;
      }

      page.minify = {
        collapseWhitespace: mode === 'production',
      };

      return page;
    });

    pages.forEach((page, index) => {
      const q = `HtmlWebpackPlugin${index}`;

      plugins[q] = new HtmlWebpackPlugin(page);
    });
  }

  const eslintRc = pathToEslintrc(root, mode);
  const stylelint = pathToStylelint(root, mode);

  if (stylelint) {
    plugins.StylelintWebpackPlugin = new StylelintWebpackPlugin({
      configFile: stylelint,
    });
  }

  if (isString(eslintRc)) {
    plugins.EslintWebpackPlugin = new EslintWebpackPlugin({
      context,
      eslintPath: require.resolve('eslint'),
      extensions,
      failOnError: mode === 'production' && !conf.debug,
    });
  }

  const env = conf.global || {};

  if (conf.__isBackend) {
    env.ROOT_DIRNAME = root;
  }
  if (typeof global.LIVE_RELOAD_PORT === 'number') {
    env.LIVE_RELOAD_PORT = global.LIVE_RELOAD_PORT;
  }

  const definePluginOpts = {
    'process.env.NODE_ENV': JSON.stringify(mode),
    ...Object.keys(env).reduce((prev, curr) => {
      prev[`process.env.${curr}`] = JSON.stringify(env[curr]);

      return prev;
    }, {}),
  };

  plugins.DefinePlugin = new webpack.DefinePlugin(definePluginOpts);

  if (conf.copy) {
    let _prop = null;
    let _opts = {};
    if (isObject(conf.copy)) {
      if (conf.copy.from && conf.copy.to) {
        _prop = [conf.copy];
      } else if (conf.copy.files) {
        _prop = conf.copy.files;
        _opts = conf.copy.opts || {};
      }
    } else if (isArray(conf.copy)) {
      _prop = conf.copy;
    }
    if (_prop) {
      plugins.CopyWebpackPlugin = new CopyWebpackPlugin({ options: _opts, patterns: _prop });
    }
  }
  /**
   * DEVELOPMENT
   * */
  if (mode === 'development' && !conf.webview) {
    if (!conf.__library && conf.nodejs && !global.ISOMORPHIC) {
      const opts = await getNodemonOptions(distFolder, distPath, conf);

      plugins.NodemonPlugin = new NodemonPlugin(opts);
    } else if (global.ISOMORPHIC && conf.__isIsomorphicBackend) {
      const opts = await getNodemonOptions(distFolder, distPath, conf);

      plugins.SSRDevelopment = new SSRDevelopment(opts);
    }

    plugins.WatchIgnorePlugin = new webpack.WatchIgnorePlugin({
      paths: [/css\.d\.ts$/],
    });

    if (conf.__isIsomorphicStyles) {
      plugins.MiniCssExtractPlugin = new MiniCssExtractPlugin({
        filename: 'css/styles.css',
      });
    }
  }
  /**
   * PRODUCTION
   * */
  if (mode === 'production') {
    plugins.CircularDependencyPlugin = new CircularDependencyPlugin({
      exclude: /node_modules/,
    });

    plugins.CaseSensitivePathsPlugin = new CaseSensitivePathsPlugin();

    const styleName = conf.styles && conf.styles.indexOf('.css') >= 0 ? conf.styles : 'css/styles.css';

    plugins.MiniCssExtractPlugin = new MiniCssExtractPlugin({
      filename: styleName,
    });

    plugins.FlagDependencyUsagePlugin = new FlagDependencyUsagePlugin();

    plugins.FlagIncludedChunksPlugin = new FlagIncludedChunksPlugin();

    plugins.NoEmitOnErrorsPlugin = new webpack.NoEmitOnErrorsPlugin();

    plugins.SideEffectsFlagPlugin = new webpack.optimize.SideEffectsFlagPlugin();
  }

  if (conf.analyzer) {
    const analyzerPort = await fpPromise(8888);

    plugins.BundleAnalyzerPlugin = new BundleAnalyzerPlugin(
      mode === 'development'
        ? {
            analyzerPort,
          }
        : {
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'webpack-report.html',
          },
    );

    plugins.StatoscopeWebpackPlugin = new StatoscopeWebpackPlugin({
      watchMode: mode === 'development',
    });
  }

  if (conf.__isIsomorphic) {
    plugins.LoadablePlugin = new LoadablePlugin({ filename: 'stats.json', writeToDisk: true });
  }

  if (conf.webview) {
    plugins.HtmlInlineScriptWebpackPlugin = new HtmlInlineScriptWebpackPlugin();
    plugins.HtmlInlineCssWebpackPlugin = new HtmlInlineCssWebpackPlugin();
    plugins.WebViewHTMLWrapper = new WebViewHTMLWrapper({
      dist: distPath,
    });
    if (mode === 'development' && conf.debug) {
      plugins.VConsoleWebpackPlugin = new VConsoleWebpackPlugin({
        enable: true,
      });
    }
  }

  return plugins;
};

const makePlugins = async (conf, root, packageJson, mode, webpack, context) => {
  const plugins = await getPlugins(conf, mode, root, packageJson, webpack, context);

  return new Collection({
    data: plugins,
    props: {},
  });
};

module.exports = makePlugins;
