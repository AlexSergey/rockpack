const { existsSync } = require('fs');
const { isString, isObject } = require('valid-types');
const Collection = require('../utils/Collection');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const formatter = require("@becklyn/typescript-error-formatter");

function babelOpts({
   isNodejs = false,
   framework = false,
   loadable = false
}) {
    const root = path.dirname(require.main.filename);
    const packageJson = existsSync(path.resolve(root, 'package.json')) ? require(path.resolve(root, 'package.json')) : {};
    let corejs = false;

    if (packageJson && isObject(packageJson.dependencies)) {
        if (isString(packageJson.dependencies['core-js'])) {
            corejs = packageJson.dependencies['core-js'];
        }
    }

    var opts = {
        babelrc: false,
        presets: [
            [require.resolve('@babel/preset-env'), Object.assign({
                modules: false,
                loose: true,
            }, isNodejs ? {
                targets: {
                    node: "current"
                }
            } : {
                targets: {
                    browsers: [
                        "> 5%"
                    ]
                }
            }, isString(corejs) ? {
                corejs,
                useBuiltIns: 'usage'
            } : {})]
        ],
        plugins: [],
        env: {
            production: {}
        }
    };

    switch (framework) {
        case 'react':
            opts.presets.push(
                require.resolve('@babel/preset-react')
            );

            opts.plugins = opts.plugins.concat([
                require.resolve('@babel/plugin-syntax-dynamic-import'),
                require.resolve('@babel/plugin-transform-flow-comments'),
                [require.resolve('@babel/plugin-proposal-decorators'), { "legacy": true }],
                require.resolve('@babel/plugin-proposal-class-properties'),
                require.resolve('@babel/plugin-proposal-object-rest-spread')
            ]);

            opts.env.production = Object.assign({}, opts.env.production, {
                plugins: [
                    require.resolve('@babel/plugin-transform-react-constant-elements'),
                    require.resolve('@babel/plugin-transform-react-inline-elements'),
                    require.resolve('babel-plugin-transform-react-pure-class-to-function'),
                    require.resolve('babel-plugin-transform-react-remove-prop-types')
                ]
            });
            break;
    }

    if (loadable) {
        opts.plugins.push(
            require.resolve('@loadable/babel-plugin')
        );
    }

    return opts;
}

const getPostcssConfig = (root) => {
    const pth = existsSync(path.resolve(root, './postcss.config.js')) ? path.resolve(root, './postcss.config.js') : path.resolve(__dirname, '../configs/postcss.config.js');

    return {
        path: pth
    }
};

function getModules(conf = {}, mode, root) {
    let extractStyles = conf.styles && mode === 'production';

    let debug = false;

    if (mode === 'development') {
        debug = true;
    }
    if (conf.debug) {
        debug = true;
    }

    let tsConfig = false;

    if (existsSync(path.resolve(root, './tsconfig.js'))) {
        tsConfig = path.resolve(root, './tsconfig.js');
        if (debug) {
            if (existsSync(path.resolve(root, './tsconfig.debug.js'))) {
                tsConfig = path.resolve(root, './tsconfig.debug.js');
            }
        }
    }

    if (existsSync(path.resolve(root, './tsconfig.json'))) {
        tsConfig = path.resolve(root, './tsconfig.json');
        if (debug) {
            if (existsSync(path.resolve(root, './tsconfig.debug.json'))) {
                tsConfig = path.resolve(root, './tsconfig.debug.json');
            }
        }
    }

    if (isString(conf.tsconfig)) {
        if (existsSync(path.resolve(root, conf.tsconfig))) {
            tsConfig = path.resolve(root, conf.tsconfig);
        }
    }

    let isTypeScriptStylesModules = !!tsConfig;

    let cssModules;
    let scssModules;
    let lessModules;

    let css;
    let scss;
    let less;

    if (conf.__isIsomorphicStyles) {
        css = [
            extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } }
        ];
        scss = [
            extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
            { loader: require.resolve('sass-loader'), options: { sourceMap: debug } }
        ];
        less = [
            extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
            { loader: require.resolve('less-loader'), options: { sourceMap: debug } }
        ];

        cssModules = [
            extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
            { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } }
        ];
        scssModules = [
            extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
            { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
            { loader: require.resolve('sass-loader'), options: { sourceMap: debug } }
        ];
        lessModules = [
            extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
            { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
            { loader: require.resolve('less-loader'), options: { sourceMap: debug } }
        ];

    } else {
        css = [
            extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } }
        ];
        scss = [
            extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
            { loader: require.resolve('sass-loader'), options: { sourceMap: debug } }
        ];
        less = [
            extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
            { loader: require.resolve('less-loader'), options: { sourceMap: debug } }
        ];

        cssModules = [
            extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
            { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } }
        ];
        scssModules = [
            extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
            { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
            { loader: require.resolve('sass-loader'), options: { sourceMap: debug } }
        ];
        lessModules = [
            extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader'), options: { sourceMap: debug } },
            { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
            { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
            { loader: require.resolve('less-loader'), options: { sourceMap: debug } }
        ];
    }

    if (isTypeScriptStylesModules) {
        if (conf.__isIsomorphicStyles) {
            cssModules = [
                extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
                { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
                { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
                { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } }
            ];
            scssModules = [
                extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
                { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
                { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
                { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
                { loader: require.resolve('sass-loader'), options: { sourceMap: debug } }
            ];
            lessModules = [
                extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
                { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
                { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
                { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
                { loader: require.resolve('less-loader'), options: { sourceMap: debug } }
            ];
        }
        else {
            cssModules = [
                extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader'), options: { sourceMap: debug } },
                { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
                { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
                { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } }
            ];
            scssModules = [
                extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader'), options: { sourceMap: debug } },
                { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
                { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
                { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
                { loader: require.resolve('sass-loader'), options: { sourceMap: debug } }
            ];
            lessModules = [
                extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader'), options: { sourceMap: debug } },
                { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
                { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
                { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
                { loader: require.resolve('less-loader'), options: { sourceMap: debug } }
            ];
        }
    }

    let finalConf = {
        handlebars: {
            test: /\.(hbs|handlebars)$/,
            use: [
                {
                    loader: require.resolve('handlebars-loader')
                }
            ]
        },

        asyncAssets: {
            test: /\.async\.(html|css)$/,
            use: [
                {
                    loader: require.resolve('file-loader'),
                    query: {
                        name: '[name].[hash].[ext]'
                    }
                },
                {
                    loader: require.resolve('extract-loader')
                },
            ]
        },

        jade: {
            test: /\.(pug|jade)$/,
            use: [
                {
                    loader: require.resolve('pug-loader')
                }
            ]
        },

        mdx: {
            test: /\.mdx$/,
            exclude: /(node_modules|bower_components)/,
            use: [
                {
                    loader: require.resolve('babel-loader'),
                    query: babelOpts({
                        isNodejs: !!conf.nodejs,
                        framework: 'react',
                        loadable: conf.__isIsomorphicLoader
                    })
                },
                {
                    loader: require.resolve('@mdx-js/loader')
                }
            ]
        },

        graphql: {
            test: /\.graphql?$/,
            use: [
                {
                    loader: require.resolve('webpack-graphql-loader'),
                    options: {
                        // validate: true,
                        // schema: "./path/to/schema.json",
                        // removeUnusedFragments: true
                        // etc. See "Loader Options" below
                    }
                }
            ]
        },

        nunjucks: {
            test: /\.(njk|nunjucks)$/,
            use: [
                {
                    loader: require.resolve('nunjucks-isomorphic-loader'),
                    query: {
                        root: [root]
                    }
                }
            ]
        },

        tsx: {
            test: /\.tsx$/,
            use: conf.__isIsomorphicLoader ? [
                {
                    loader: require.resolve('babel-loader'),
                    query: babelOpts({
                        isNodejs: !!conf.nodejs,
                        framework: 'react',
                        loadable: true
                    })
                },
                {
                    loader: require.resolve('ts-loader'),
                    options: {
                        configFile: isString(tsConfig) ?
                            tsConfig :
                            path.resolve(__dirname, '../configs/tsconfig.for.isomorphic.json'),
                        errorFormatter: (message, colors) => formatter(message, colors, process.cwd()),
                        onlyCompileBundledFiles: true
                    }
                }
            ] : [
                {
                    loader: require.resolve('ts-loader'),
                    options: {
                        configFile: isString(tsConfig) ?
                            tsConfig :
                            path.resolve(__dirname, '../configs/tsconfig.json'),
                        errorFormatter: (message, colors) => formatter(message, colors, process.cwd()),
                        onlyCompileBundledFiles: true
                    }
                }
            ]
        },

        ts: {
            test: /\.ts$/,
            use: conf.__isIsomorphicLoader ? [
                {
                    loader: require.resolve('babel-loader'),
                    query: babelOpts({
                        isNodejs: !!conf.nodejs,
                        framework: false,
                        loadable: true
                    })
                },
                {
                    loader: require.resolve('ts-loader'),
                    options: {
                        configFile: isString(tsConfig) ?
                            tsConfig :
                            path.resolve(__dirname, '../configs/tsconfig.for.isomorphic.json'),
                        errorFormatter: (message, colors) => formatter(message, colors, process.cwd()),
                        onlyCompileBundledFiles: true
                    }
                }
            ] : [
                {
                    loader: require.resolve('ts-loader'),
                    options: {
                        configFile: isString(tsConfig) ?
                            tsConfig :
                            path.resolve(__dirname, '../configs/tsconfig.json'),
                        errorFormatter: (message, colors) => formatter(message, colors, process.cwd()),
                        onlyCompileBundledFiles: true
                    }
                }
            ]
        },

        shaders: {
            test: /\.(glsl|vs|fs)$/,
            use: [
                {
                    loader: require.resolve('shader-loader')
                }
            ]
        },

        cssModules: {
            test: /\.modules\.css$/,
            use: cssModules,
            exclude: /\.async\.css$/
        },

        scssModules: {
            test: /\.modules\.scss$/,
            use: scssModules
        },

        lessModules: {
            test: /\.modules\.less$/,
            use: lessModules
        },

        css: {
            test: /\.css$/,
            use: css,
            exclude: /(\.async\.css$)|(\.modules\.css$)/
        },

        scss: {
            test: /\.scss$/,
            use: scss,
            exclude: /\.modules\.scss$/
        },

        less: {
            test: /\.less$/,
            use: less,
            exclude: /\.modules\.less$/
        },

        jsx: {
            test: /\.jsx$/,
            exclude: /(node_modules|bower_components)/,
            use: [
                {
                    loader: require.resolve('babel-loader'),
                    query: babelOpts({
                        isNodejs: !!conf.nodejs,
                        framework: 'react',
                        loadable: conf.__isIsomorphicLoader
                    })
                }
            ]
        },

        js: {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: [
                {
                    loader: require.resolve('babel-loader'),
                    query: babelOpts({
                        isNodejs: !!conf.nodejs
                    })
                }
            ]
        },

        vue: {
            test: /\.vue$/,
            exclude: /(node_modules|bower_components)/,
            use: [
                {
                    loader: require.resolve('vue-loader')
                }
            ]
        },

        node: {
            test: /\.node$/,
            use: require.resolve('node-loader')
        },

        video: {
            test: /\.(mp4|webm|ogg|mp3)$/,
            use: [
                {
                    loader: require.resolve('file-loader')
                }
            ]
        },

        images: conf.base64 ? {
            test: /\.(jpe?g|png|gif)$/i,
            use: [
                {
                    loader: require.resolve('url-loader'),
                    query: {
                        limit: 10000,
                        name: 'images/[name][hash].[ext]'
                    }
                }
            ]
        } : {
            test: /\.(jpe?g|png|gif)$/i,
            use: [
                {
                    loader: require.resolve('file-loader'),
                    query: {
                        name: 'images/[name][hash].[ext]'
                    }
                }
            ]
        },

        fonts: conf.base64 ? {
            test: /\.(eot|ttf|woff|woff2)$/,
            use: [
                {
                    loader: require.resolve('url-loader'),
                    query: {
                        limit: 10000,
                        name: 'fonts/[name][hash].[ext]'
                    }
                }
            ]
        } : {
            test: /\.(eot|ttf|woff|woff2)$/,
            use: [
                {
                    loader: require.resolve('file-loader'),
                    query: {
                        name: 'fonts/[name][hash].[ext]'
                    }
                }
            ]
        },

        html: {
            test: /\.html$/,
            use: {
                loader: require.resolve('html-loader')
            },
            exclude: /\.async\.(html|css)$/
        },

        markdown: {
            test: /\.md$/,
            use: [
                {
                    loader: require.resolve('html-loader')
                },
                {
                    loader: require.resolve('markdown-loader')
                }
            ]
        },

        svg: {
            test: /\.svg$/,
            use: [
                {
                    loader: require.resolve('svg-inline-loader')
                },
                {
                    loader: require.resolve('svgo-loader'),
                    options: {
                        plugins: [{ removeTitle: true }, { convertColors: { shorthex: false } }, { convertPathData: false }]
                    }
                }
            ]
        }
    };

    if (existsSync(path.resolve(root, 'eslintrc.js'))) {
        finalConf.jsPre = {
            enforce: 'pre',
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [{
                loader: require.resolve('eslint-loader'),
                options: {
                    configFile: path.resolve(root, 'eslintrc.js'),
                    formatter: require.resolve('eslint-formatter-friendly')
                }
            }]
        }
    }

    return finalConf;
}

const _makeModules = (modules, conf = {}, excludeModules = []) => {
    excludeModules.forEach(propsToDelete => {
        delete modules[propsToDelete];
    });
    return new Collection({
        data: modules,
        props: {}
    });
};

const makeModules = (conf, root, packageJson, mode, excludeModules) => {
    let modules = getModules(conf, mode, root);

    return _makeModules(modules, conf, excludeModules);
};

module.exports = { makeModules, babelOpts };
