const { isString } = require('valid-types');
const path = require('path');
const createBabelPresets = require('@rockpack/babel');
const formatter = require('@becklyn/typescript-error-formatter');
const Collection = require('../utils/Collection');
const pathToTSConf = require('../utils/pathToTSConf');
const getStylesRules = require('../utils/getStylesRules');

function getModules(conf = {}, mode, root) {
  const isProduction = mode === 'production';

  const { css, scss, less } = getStylesRules(conf, mode, root);

  let debug = false;

  if (!isProduction) {
    debug = true;
  }

  if (conf.debug) {
    debug = true;
  }

  const tsConfig = pathToTSConf(root, mode, debug);

  const isTypeScript = isString(tsConfig);

  return {
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
          query: createBabelPresets({
            isNodejs: !!conf.nodejs,
            framework: 'react',
            loadable: conf.__isIsomorphicLoader,
            isProduction
          })
        },
        {
          loader: require.resolve('@mdx-js/loader')
        }
      ]
    },

    mjs: {
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
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

    tsx: {
      test: /\.tsx$/,
      use: conf.__isIsomorphicLoader ? [
        {
          loader: require.resolve('babel-loader'),
          query: createBabelPresets({
            isNodejs: !!conf.nodejs,
            framework: 'react',
            loadable: true,
            isProduction,
            typescript: true
          })
        },
        {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: !conf.__library,
            configFile: isTypeScript ?
              tsConfig :
              path.resolve(__dirname, '../configs/tsconfig.for.isomorphic.json'),
            errorFormatter: (message, colors) => formatter(message, colors, process.cwd())
          }
        }
      ] : [
        {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: !conf.__library,
            configFile: isTypeScript ?
              tsConfig :
              path.resolve(__dirname, '../configs/tsconfig.json'),
            errorFormatter: (message, colors) => formatter(message, colors, process.cwd())
          }
        }
      ]
    },

    ts: {
      test: /\.ts$/,
      use: conf.__isIsomorphicLoader ? [
        {
          loader: require.resolve('babel-loader'),
          query: createBabelPresets({
            isNodejs: !!conf.nodejs,
            framework: false,
            loadable: true,
            isProduction,
            typescript: true
          })
        },
        {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: !conf.__library,
            configFile: isTypeScript ?
              tsConfig :
              path.resolve(__dirname, '../configs/tsconfig.for.isomorphic.json'),
            errorFormatter: (message, colors) => formatter(message, colors, process.cwd())
          }
        }
      ] : [
        {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: !conf.__library,
            configFile: isTypeScript ?
              tsConfig :
              path.resolve(__dirname, '../configs/tsconfig.json'),
            errorFormatter: (message, colors) => formatter(message, colors, process.cwd())
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
      test: /\.module\.css$/,
      use: css.module,
      exclude: /\.async\.css$/
    },

    scssModules: {
      test: /\.module\.scss$/,
      use: scss.module
    },

    lessModules: {
      test: /\.module\.less$/,
      use: less.module
    },

    css: {
      test: /\.css$/,
      use: css.simple,
      exclude: /(\.async\.css$)|(\.module\.css$)/
    },

    scss: {
      test: /\.scss$/,
      use: scss.simple,
      exclude: /\.module\.scss$/
    },

    less: {
      test: /\.less$/,
      use: less.simple,
      exclude: /\.module\.less$/
    },

    jsx: {
      test: /\.jsx$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          query: createBabelPresets({
            isNodejs: !!conf.nodejs,
            framework: 'react',
            loadable: conf.__isIsomorphicLoader,
            isProduction
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
          query: createBabelPresets({
            isNodejs: !!conf.nodejs,
            isProduction
          })
        }
      ],
      sideEffects: false
    },

    node: {
      test: /\.node$/,
      use: require.resolve('node-loader')
    },

    video: {
      test: /\.(mp4|webm|ogg|mp3|avi|mov|wav)$/,
      use: [
        {
          loader: require.resolve('file-loader'),
          query: {
            name: 'media/[name][hash].[ext]'
          }
        }
      ]
    },

    pdf: {
      test: /\.pdf$/,
      use: [
        {
          loader: require.resolve('file-loader'),
          query: {
            name: 'images/[name][hash].[ext]'
          }
        }
      ]
    },

    images: {
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
    },

    fonts: {
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

    svgJSX: {
      test: /\.component\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: [{
        loader: require.resolve('babel-loader'),
        query: createBabelPresets({
          isNodejs: !!conf.nodejs,
          framework: 'react',
          loadable: conf.__isIsomorphicLoader,
          isProduction
        })
      }, {
        loader: require.resolve('@svgr/webpack')
      }]
    },

    svg: {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: require.resolve('url-loader'),
          query: {
            limit: 10000,
            name: 'svg/[path][name].[ext]',
          }
        },
        {
          loader: require.resolve('svgo-loader'),
          options: {
            plugins: [{
              removeTitle: true
            }, {
              convertColors: {
                shorthex: false
              }
            }, {
              convertPathData: false
            }]
          }
        }
      ],
      exclude: /\.component\.svg(\?v=\d+\.\d+\.\d+)?$/
    },
  };
}

const _makeModules = (modules, conf, excludeModules = []) => {
  excludeModules.forEach(propsToDelete => {
    // eslint-disable-next-line no-param-reassign
    delete modules[propsToDelete];
  });
  return new Collection({
    data: modules,
    props: {}
  });
};

const makeModules = (conf, root, packageJson, mode, excludeModules) => {
  const modules = getModules(conf, mode, root);

  return _makeModules(modules, conf, excludeModules);
};

module.exports = { makeModules };
