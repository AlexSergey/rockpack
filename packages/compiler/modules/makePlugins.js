const { existsSync } = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Collection = require('../utils/Collection');
const { isString, isBoolean, isArray, isObject, isNumber, isFunction } = require('valid-types');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const makeBanner = require('./makeBanner');
const ReloadHtmlWebpackPlugin = require('../utils/reloadHTML');
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
const WebpackBar = require('webpackbar');
const FlagDependencyUsagePlugin = require('webpack/lib/FlagDependencyUsagePlugin');
const FlagIncludedChunksPlugin = require('webpack/lib/optimize/FlagIncludedChunksPlugin');
const Dotenv = require('dotenv-webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LiveReloadPlugin = require('webpack-livereload-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const fpPromise = require('../utils/findFreePort');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');

function getTitle(packageJson) {
    return `${packageJson.name.split('_').join(' ')}`;
}

const getPlugins = async (conf, mode, root, packageJson, webpack, version) => {
    let plugins = {};
    /**
     * COMMON
     * */
    plugins.WebpackBar = new WebpackBar({
        reporters: [
            'basic',
            'fancy',
            'profile',
            'stats'
        ],
        profile: mode === 'production',
        stats: mode === 'production'
    });

    plugins.CircularDependencyPlugin = new CircularDependencyPlugin({
        exclude: /node_modules/,
    });

    plugins.VueLoaderPlugin = new VueLoaderPlugin();

    plugins.CaseSensitivePathsPlugin = new CaseSensitivePathsPlugin();

    if (existsSync(path.resolve(root, '.env'))) {
        plugins.Dotenv = new Dotenv({
            path: path.resolve(root, '.env')
        });
    }
    else if (isString(conf.dotenv)) {
        plugins.Dotenv = new Dotenv({
            path: conf.dotenv
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
    } else {
        if (isBoolean(conf.banner) && conf.banner === false) {
            banner = false;
        }
    }

    conf.banner = banner;

    if (conf.banner) {
        plugins.BannerPlugin = new webpack.BannerPlugin({
            banner: !banner ? '' : banner,
            entryOnly: true
        });
    }
    if (mode === 'development') {
        if (conf.nodejs) {
            let opts = {
                watch: path.resolve(conf.dist),
                verbose: true,
                ignore: ['*.map', '*.hot-update.json', '*.hot-update.js'],
                script: './dist/index.js'
            };
            if (isString(conf.nodemon)) {
                opts.script = conf.nodemon;
            }
            plugins.NodemonPlugin = new NodemonPlugin(opts);
        }
    }

    if (conf._liveReload && mode === 'development') {
        const liveReloadPort = await fpPromise(isNumber(conf.liveReload) ? conf.liveReload : 35729);
        conf._liveReloadPort = liveReloadPort;
        process.env.__LIVE_RELOAD__ = liveReloadPort;
        plugins.liveReload = new LiveReloadPlugin({ port: liveReloadPort });

        const errors = ['unhandledRejection', 'uncaughtException'];

        errors.map(error => {
            process.on(error, () => {
                if (plugins.liveReload && plugins.liveReload.server && isFunction(plugins.liveReload.server.close)) {
                    plugins.liveReload.server.close();
                }
                process.exit(1);
            });
        });

        const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

        signals.map(signal => {
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
    if (HTMLProcessing) {
        if (conf.html && isArray(conf.html)) {
            pages = conf.html;
        }
        else {
            pages = [
                Object.assign({
                    title: (conf.html && conf.html.title) || getTitle(packageJson),
                    code: (conf.html && conf.html.code) ? conf.html.code : null,
                    favicon: (conf.html && conf.html.favicon) ? conf.html.favicon : null,
                    template: (conf.html && conf.html.template) || path.resolve(__dirname, '..', './index.ejs')
                }, conf._liveReloadPort ? {
                    liveReloadPort: conf._liveReloadPort
                } : {})
            ];
        }

        pages = pages.map(page => {
            if (version) {
                page.version = version;
            }
            if (conf._liveReloadPort) {
                page.liveReloadPort = conf._liveReloadPort;
            }
            if (!page.template) {
                page.template = path.resolve(__dirname, '..', './index.ejs');
            }
            if (!page.filename) {
                page.filename = page.template.slice(page.template.lastIndexOf('/') + 1, page.template.lastIndexOf('.'));
                page.filename += '.html';
            }
            page.inject = false;

            page.minify = {
                collapseWhitespace: mode === 'production'
            };

            return page;
        });

        pages.forEach((page, index) => {
            let q = `HtmlWebpackPlugin${index}`;

            plugins[q] = new HtmlWebpackPlugin(page);
        });

        if (mode === 'development') {
            if (!isNumber(conf.server.browserSyncPort)) {
                plugins.ReloadHtmlWebpackPlugin = new ReloadHtmlWebpackPlugin();
            }
        }
    }

    if (existsSync(path.resolve(root, 'eslintrc.js'))) {
        plugins.LoadOptions = new webpack.LoaderOptionsPlugin({
            test: /\.(js|jsx)$/,
            options: {
                eslint: {
                    configFile: path.resolve(root, 'eslintrc.js'),
                    eslintPath: require.resolve('eslint'),
                    formatter: require(require.resolve('eslint-formatter-pretty')),
                    ignore: false,
                    useEslintrc: false,
                    cache: false,
                }
            },
        });
    }

    let env = conf.global || {};
    if (!!conf.__frontendHasVendor) {
        env.FRONTEND_HAS_VENDOR = true;
    }
    let definePluginOpts = Object.assign(
        {},
        {
            'process.env.NODE_ENV': JSON.stringify(mode)
        },
        Object.keys(env).reduce((prev, curr) => {
            prev[`process.env.${curr}`] = JSON.stringify(env[curr]);
            return prev;
        }, {})
    );
    plugins.DefinePlugin = new webpack.DefinePlugin(definePluginOpts);

    if (existsSync(path.resolve(root, '.flowconfig'))) {
        plugins.FlowBabelWebpackPlugin = new FlowBabelWebpackPlugin();
    }

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
            plugins.CopyWebpackPlugin = new CopyWebpackPlugin(_prop, _opts);
        }
    }
    /**
     * DEVELOPMENT
     * */
    if (mode === 'development') {
        if (conf.server && isNumber(conf.server.browserSyncPort)) {
            conf.server.browserSyncPort = await fpPromise(conf.server.browserSyncPort);

            plugins.BrowserSyncPlugin = new BrowserSyncPlugin(
                {
                    port: conf.server.browserSyncPort,
                    proxy: `http://${conf.server.host}:${conf.server.port}`
                },
                { reload: false }
            );
        }

        plugins.HotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin();

        plugins.NamedChunksPlugin = new webpack.NamedChunksPlugin();

        plugins.NamedModulesPlugin = new webpack.NamedModulesPlugin();
    }
    /**
     * PRODUCTION
     * */
    if (mode === 'production') {
        if (conf.stats) {
            plugins.StatsWriterPlugin = new StatsWriterPlugin({
                fields: null,
                stats: {chunkModules: true}
            });
        }

        let addVersion = !!version;
        let styleName = conf.styles && conf.styles.indexOf('.css') >= 0 ? conf.styles : 'css/styles.css';
        styleName = styleName.split('.');

        if (styleName.length > 1 && addVersion && version) {
            let last = styleName.length - 1;
            let filename = last - 1;
            styleName[filename] = styleName[filename] + '-' + version;
        }
        styleName = styleName.join('.');

        plugins.ModuleConcatenationPlugin = new webpack.optimize.ModuleConcatenationPlugin();

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

        plugins.CleanWebpackPlugin = new CleanWebpackPlugin();

        plugins.OccurrenceOrderPlugin = new webpack.optimize.OccurrenceOrderPlugin();

        plugins.FlagDependencyUsagePlugin = new FlagDependencyUsagePlugin();

        plugins.FlagIncludedChunksPlugin = new FlagIncludedChunksPlugin();

        plugins.NoEmitOnErrorsPlugin = new webpack.NoEmitOnErrorsPlugin();

        plugins.SideEffectsFlagPlugin = new webpack.optimize.SideEffectsFlagPlugin();

        plugins.UglifyJS = new UglifyJsPlugin({
            sourceMap: conf.debug,
            minify(file, sourceMap) {
                let terserOptions = {
                    mangle: true,
                    output: {
                        comments: new RegExp('banner')
                    },
                    compress: {
                        drop_console: !conf.debug,
                        drop_debugger: !conf.debug
                    }
                };

                if (sourceMap) {
                    terserOptions.sourceMap = {
                        content: sourceMap,
                    };
                }

                return require('terser').minify(file, terserOptions);
            }
        });

        plugins.OptimizeCssAssetsPlugin = new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        });
    }

    if (isNumber(conf.analyzerPort)) {
        conf.analyzerPort = await fpPromise(8888);

        plugins.BundleAnalyzerPlugin = new BundleAnalyzerPlugin(mode === 'development' ? {
            analyzerPort: conf.analyzerPort
        } : {
            analyzerMode: 'static',
            reportFilename: 'webpack-report.html',
            openAnalyzer: false,
        });
    }

    if (conf.nodejs && conf.__isIsomorphicLoader) {
        plugins.LoadablePlugin = new LoadablePlugin({ filename: 'stats.json', writeToDisk: true });
    }

    return plugins;
};

const _makePlugins = (plugins) => {
    return new Collection({
        data: plugins,
        props: {}
    });
};

const makePlugins = async (conf, root, packageJson, mode, webpack, version) => {
    let modules = await getPlugins(conf, mode, root, packageJson, webpack, version);

    return _makePlugins(modules, conf);
};

module.exports = makePlugins;
