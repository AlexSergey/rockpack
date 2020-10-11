const { existsSync } = require('fs');
const AntdDayjsPlugin = require('antd-dayjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { isString, isBoolean, isArray, isObject, isNumber, isFunction } = require('valid-types');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const cssNano = require('cssnano');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FlagDependencyUsagePlugin = require('webpack/lib/FlagDependencyUsagePlugin');
const FlagIncludedChunksPlugin = require('webpack/lib/optimize/FlagIncludedChunksPlugin');
const Dotenv = require('dotenv-webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const fpPromise = require('../utils/findFreePort');
const MakePotPlugin = require('../localazer/makePot/MakePotPlugin');
const pathToEslintrc = require('../utils/pathToEslintrc');
const Collection = require('../utils/Collection');
const makeBanner = require('./makeBanner');
const makeResolve = require('./makeResolve');
const ReloadHtmlWebpackPlugin = require('../utils/reloadHTML');
const pathToTSConf = require('../utils/pathToTSConf');

function getTitle(packageJson) {
  if (!packageJson) {
    return false;
  }
  if (!packageJson.name) {
    return false;
  }
  return `${packageJson.name.split('_')
    .join(' ')}`;
}

const getPlugins = async (conf, mode, root, packageJson, webpack, context) => {
  const tsConfig = pathToTSConf(root, mode, false);
  const { extensions } = makeResolve();

  const isTypeScript = isString(tsConfig);

  const plugins = {};

  if (conf.makePOT) {
    plugins.LocalizationWebpackPlugin = new MakePotPlugin(conf.localization);

    return plugins;
  }

  plugins.ProgressPlugin = new ProgressBarPlugin();

  plugins.FriendlyErrorsPlugin = new FriendlyErrorsWebpackPlugin({
    compilationSuccessInfo: {
      messages: conf.messages
    },
  });

  if (isTypeScript) {
    plugins.ForkTsCheckerPlugin = new ForkTsCheckerWebpackPlugin();
  }

  if (packageJson.dependencies && packageJson.dependencies.antd) {
    plugins.AntdDayjsPlugin = new AntdDayjsPlugin();
  }

  if (existsSync(path.resolve(root, '.env.example'))) {
    plugins.Dotenv = new Dotenv({
      path: path.resolve(root, '.env'),
      safe: true,
      allowEmptyValues: true
    });
  } else if (existsSync(path.resolve(root, '.env'))) {
    plugins.Dotenv = new Dotenv({
      path: path.resolve(root, '.env')
    });
  }

  if (conf.write && mode !== 'production') {
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
      entryOnly: true
    });
  }

  if (
    mode === 'development' &&
    conf.nodejs
  ) {
    const defaultInspectPort = 9224;
    const freeInspectPort = await fpPromise(defaultInspectPort);
    const distPath = path.isAbsolute(conf.dist) ? conf.dist : path.resolve(root, conf.dist);
    const d = path.dirname(distPath);

    const script = path.join(d, path.basename(distPath));

    const opts = {
      watch: d,
      verbose: false,
      nodeArgs: conf.__isIsomorphicBackend ? [
        '--require="source-map-support/register"',
      ] : [
        `--inspect=${freeInspectPort}`,
        '--require="source-map-support/register"'
      ],
      ignore: [
        '*.map',
        '*.hot-update.json',
        '*.hot-update.js',
        'stats.json'
      ],
      script,
      ext: 'js',
      quiet: true
    };

    conf.messages.push('nodemon is running');

    if (!conf.__isIsomorphicBackend) {
      conf.messages.push(`node-inspect is available on ${freeInspectPort} port`);
    }

    plugins.NodemonPlugin = new NodemonPlugin(opts);
  }
  if (conf._liveReload && mode === 'development') {
    const liveReloadPort = await fpPromise(isNumber(conf.liveReload) ? conf.liveReload : 35729);
    conf._liveReloadPort = liveReloadPort;
    process.env.__LIVE_RELOAD__ = liveReloadPort;
    plugins.liveReload = new LiveReloadPlugin({ port: liveReloadPort, delay: 300, quiet: true });

    conf.messages.push(`LiveReload is listening on port ${liveReloadPort}`);

    const errors = ['unhandledRejection', 'uncaughtException'];

    errors.forEach(error => {
      process.on(error, () => {
        if (plugins.liveReload && plugins.liveReload.server && isFunction(plugins.liveReload.server.close)) {
          plugins.liveReload.server.close();
        }
        process.exit(1);
      });
    });

    const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

    signals.forEach(signal => {
      process.once(signal, () => {
        if (plugins.liveReload && plugins.liveReload.server && isFunction(plugins.liveReload.server.close)) {
          plugins.liveReload.server.close();
        }
        process.exit(0);
      });
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
        Object.assign({
          title: (conf.html && conf.html.title) || (getTitle(packageJson) ? getTitle(packageJson) : ''),
          code: (conf.html && conf.html.code) ? conf.html.code : null,
          favicon: (conf.html && conf.html.favicon) ? conf.html.favicon : null,
          template: (conf.html && conf.html.template) || path.resolve(__dirname, '..', './index.ejs')
        }, conf._liveReloadPort ? {
          liveReloadPort: conf._liveReloadPort
        } : {})
      ];
    }

    pages = pages.map(page => {
      if (conf._liveReloadPort) {
        page.liveReloadPort = conf._liveReloadPort;
      }
      if (!page.template) {
        page.template = path.resolve(__dirname, '..', './index.ejs');
      }
      if (!page.filename) {
        page.filename = page.template.slice(page.template.lastIndexOf(path.sep) + 1, page.template.lastIndexOf('.'));
        page.filename += '.html';
      }
      page.inject = false;

      page.minify = {
        collapseWhitespace: mode === 'production'
      };

      return page;
    });

    pages.forEach((page, index) => {
      const q = `HtmlWebpackPlugin${index}`;

      plugins[q] = new HtmlWebpackPlugin(page);
    });

    if (mode === 'development') {
      plugins.ReloadHtmlWebpackPlugin = new ReloadHtmlWebpackPlugin();
    }
  }

  const eslintRc = pathToEslintrc(root, mode);

  if (!conf.makePOT && isString(eslintRc)) {
    plugins.EslintWebpackPlugin = new EslintWebpackPlugin({
      extensions,
      context,
      failOnError: mode === 'production',
      eslintPath: require.resolve('eslint')
    });
  }

  const env = conf.global || {};

  if (conf.__isBackend) {
    env.ROOT_DIRNAME = root;
  }

  const definePluginOpts = Object.assign(
    {},
    {
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    Object.keys(env)
      .reduce((prev, curr) => {
        prev[`process.env.${curr}`] = JSON.stringify(env[curr]);
        return prev;
      }, {})
  );
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
      plugins.CopyWebpackPlugin = new CopyWebpackPlugin({ patterns: _prop, options: _opts });
    }
  }
  /**
   * DEVELOPMENT
   * */
  if (mode === 'development') {
    plugins.NamedModulesPlugin = new webpack.NamedModulesPlugin();
    plugins.NamedChunksPlugin = new webpack.NamedChunksPlugin();

    plugins.WatchIgnorePlugin = new webpack.WatchIgnorePlugin([
      /css\.d\.ts$/
    ]);

    plugins.HotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin();

    if (conf.__isIsomorphicStyles) {
      plugins.MiniCssExtractPlugin = new MiniCssExtractPlugin({
        filename: 'css/styles.css',
        insertAt: {
          after: 'title'
        }
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

    plugins.CleanWebpackPlugin = new CleanWebpackPlugin();

    plugins.ModuleConcatenationPlugin = new webpack.optimize.ModuleConcatenationPlugin();

    const styleName = conf.styles && conf.styles.indexOf('.css') >= 0 ?
      conf.styles :
      'css/styles.css';

    plugins.MiniCssExtractPlugin = new MiniCssExtractPlugin({
      filename: styleName,
      insertAt: {
        after: 'title'
      }
    });

    plugins.ImageminPlugin = new ImageminPlugin({
      disable: false,
      optipng: {
        optimizationLevel: 3
      },
      gifsicle: {
        optimizationLevel: 1
      },
      jpegtran: {
        progressive: false
      },
      svgo: {},
      pngquant: null,
      plugins: [
        imageminMozjpeg({
          quality: 85,
          progressive: true
        })
      ]
    });

    plugins.OccurrenceOrderPlugin = new webpack.optimize.OccurrenceOrderPlugin();

    plugins.FlagDependencyUsagePlugin = new FlagDependencyUsagePlugin();

    plugins.FlagIncludedChunksPlugin = new FlagIncludedChunksPlugin();

    plugins.NoEmitOnErrorsPlugin = new webpack.NoEmitOnErrorsPlugin();

    plugins.SideEffectsFlagPlugin = new webpack.optimize.SideEffectsFlagPlugin();

    plugins.OptimizeCssAssetsPlugin = new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssNano,
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    });
  }

  if (conf.analyze) {
    const analyzerPort = await fpPromise(8888);

    plugins.BundleAnalyzerPlugin = new BundleAnalyzerPlugin(mode === 'development' ? {
      analyzerPort
    } : {
      analyzerMode: 'static',
      reportFilename: 'webpack-report.html',
      openAnalyzer: false,
    });
  }

  if (conf.__isIsomorphicLoader) {
    plugins.LoadablePlugin = new LoadablePlugin({ filename: 'stats.json', writeToDisk: true });
  }

  return plugins;
};

const makePlugins = async (conf, root, packageJson, mode, webpack, context) => {
  const plugins = await getPlugins(conf, mode, root, packageJson, webpack, context);

  return new Collection({
    data: plugins,
    props: {}
  });
};

module.exports = makePlugins;
