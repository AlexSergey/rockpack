const { existsSync } = require('fs');
const { argv } = require('yargs');
const AntdDayjsPlugin = require('antd-dayjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { isString, isBoolean, isArray, isObject } = require('valid-types');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackPluginServe } = require('webpack-plugin-serve');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FlagDependencyUsagePlugin = require('webpack/lib/FlagDependencyUsagePlugin');
const FlagIncludedChunksPlugin = require('webpack/lib/optimize/FlagIncludedChunksPlugin');
const StatoscopeWebpackPlugin = require('@statoscope/ui-webpack');
const Dotenv = require('dotenv-webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const fpPromise = require('../utils/findFreePort');
const pathToEslintrc = require('../utils/pathToEslintrc');
const Collection = require('../utils/Collection');
const makeBanner = require('./makeBanner');
const makeResolve = require('./makeResolve');
const ReloadHtmlWebpackPlugin = require('../plugins/ReloadHTML');
const pathToTSConf = require('../utils/pathToTSConf');
const { SSRBackend, SSRFrontend } = require('../plugins/SSRDevelopment');
const BreakingChangesWebpack4 = require('../plugins/BreakingChangesWebpack4');
const { getTitle, getRandomInt } = require('../utils/other');

const getNodemonOptions = async (distFolder, distPath, conf) => {
  const defaultInspectPort = global.ISOMORPHIC ? getRandomInt(9000, 9999) : 9224;
  const freeInspectPort = await fpPromise(defaultInspectPort);

  const script = path.join(distFolder, path.basename(distPath));

  const opts = {
    watch: distFolder,
    verbose: false,
    nodeArgs: [
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

  return opts;
};

const getPlugins = async (conf, mode, root, packageJson, webpack, context) => {
  const tsConfig = pathToTSConf(root, mode, false);
  const { extensions } = makeResolve();
  const distPath = path.isAbsolute(conf.dist) ? conf.dist : path.resolve(root, conf.dist);
  const distFolder = path.dirname(distPath);

  const isTypeScript = isString(tsConfig);

  const plugins = {};

  if (!argv._rockpack_testing) {
    if (!global.ISOMORPHIC) {
      plugins.ProgressPlugin = new ProgressBarPlugin();
      // eslint-disable-next-line sonarjs/no-duplicated-branches
    } else if (global.ISOMORPHIC && conf.__isIsomorphicFrontend) {
      plugins.ProgressPlugin = new ProgressBarPlugin();
    }
  }

  plugins.BreakingChangesWebpack4 = new BreakingChangesWebpack4();

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

  if (existsSync(path.resolve(root, '.env'))) {
    const isExample = existsSync(path.resolve(root, '.env.example'));
    const isDefaults = existsSync(path.resolve(root, '.env.defaults'));
    /**
     * dotenv-webpack 6.0 fix
     * {}.DEBUG = namespaces;
     * Error
     * */
    const dotenv = new Dotenv({
      path: path.resolve(root, '.env'),
      safe: isExample,
      allowEmptyValues: true,
      defaults: isDefaults
    });
    if (dotenv.definitions && dotenv.definitions['process.env']) {
      delete dotenv.definitions['process.env'];
    }
    plugins.Dotenv = dotenv;
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
          title: (conf.html && conf.html.title) || (getTitle(packageJson) ? getTitle(packageJson) : ''),
          code: (conf.html && conf.html.code) ? conf.html.code : null,
          favicon: (conf.html && conf.html.favicon) ? conf.html.favicon : null,
          template: (conf.html && conf.html.template) || path.resolve(__dirname, '..', './index.ejs')
        }
      ];
    }

    pages = pages.map(page => {
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

  if (isString(eslintRc)) {
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
    if (
      !conf.nodejs &&
      !global.ISOMORPHIC
    ) {
      const defaultFrontServePort = conf.port;
      const frontServePort = await fpPromise(defaultFrontServePort);
      plugins.WebpackPluginServe = new WebpackPluginServe({
        liveReload: true,
        historyFallback: true,
        port: frontServePort,
        open: true,
        host: 'localhost',
        static: [
          conf.distContext
        ],
        client: {
          address: `localhost:${frontServePort}`,
        },
        progress: 'minimal',
        waitForBuild: true
      });
    } else if (
      conf.nodejs &&
      !global.ISOMORPHIC
    ) {
      const opts = await getNodemonOptions(distFolder, distPath, conf);

      plugins.NodemonPlugin = new NodemonPlugin(opts);
    } else if (global.ISOMORPHIC) {
      const defaultFrontReloaderPort = 8767;
      const frontReloaderPort = await fpPromise(defaultFrontReloaderPort);

      const opts = await getNodemonOptions(distFolder, distPath, conf);

      plugins.SSRDevelopmentWebpackPlugin = conf.__isIsomorphicBackend ?
        new SSRBackend(opts) :
        new SSRFrontend({
          port: frontReloaderPort,
          host: 'localhost',
          log: { level: 'warn' },
          static: [
            conf.distContext
          ],
          progress: 'minimal',
          client: {
            address: `localhost:${frontReloaderPort}`,
          }
        });
    }

    plugins.WatchIgnorePlugin = new webpack.WatchIgnorePlugin({
      paths: [
        /css\.d\.ts$/
      ]
    });

    if (conf.__isIsomorphicStyles) {
      plugins.MiniCssExtractPlugin = new MiniCssExtractPlugin({
        filename: 'css/styles.css'
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
      filename: styleName
    });

    plugins.ImageminPlugin = new ImageMinimizerPlugin({
      test: /\.(jpe?g|png|gif)$/i,
      minimizerOptions: {
        plugins: [
          ['gifsicle', { interlaced: true, optimizationLevel: 2 }],
          ['mozjpeg', { progressive: true, quality: 80 }],
          ['pngquant', { quality: [0.7, 0.9] }],
        ]
      }
    });

    plugins.FlagDependencyUsagePlugin = new FlagDependencyUsagePlugin();

    plugins.FlagIncludedChunksPlugin = new FlagIncludedChunksPlugin();

    plugins.NoEmitOnErrorsPlugin = new webpack.NoEmitOnErrorsPlugin();

    plugins.SideEffectsFlagPlugin = new webpack.optimize.SideEffectsFlagPlugin();
  }

  if (conf.analyzer) {
    const analyzerPort = await fpPromise(8888);

    plugins.BundleAnalyzerPlugin = new BundleAnalyzerPlugin(mode === 'development' ? {
      analyzerPort
    } : {
      analyzerMode: 'static',
      reportFilename: 'webpack-report.html',
      openAnalyzer: false,
    });

    plugins.StatoscopeWebpackPlugin = new StatoscopeWebpackPlugin({
      watchMode: mode === 'development'
    });
  }

  if (conf.__isIsomorphic) {
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
