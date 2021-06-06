const createBabelPresets = require('@rockpack/babel');
const Collection = require('../utils/Collection');
const getStylesRules = require('../utils/getStylesRules');
const createFileLoader = require('../utils/fileLoader');

function getModules(conf = {}, mode, root) {
  const { css, scss, less } = getStylesRules(conf, mode, root);
  const fileLoader = createFileLoader(conf);

  return {
    handlebars: {
      test: /\.(hbs|handlebars)$/,
      use: require.resolve('handlebars-loader')
    },

    asyncAssets: {
      test: /\.async\.(html|css)$/,
      use: [
        fileLoader.asyncAssets,
        require.resolve('extract-loader'),
      ]
    },

    jade: {
      test: /\.(pug|jade)$/,
      use: require.resolve('pug-loader')
    },

    mdx: {
      test: /\.mdx$/,
      exclude: /(node_modules|bower_components)/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: createBabelPresets({
            isNodejs: !!conf.nodejs,
            framework: 'react',
            isomorphic: conf.__isIsomorphic
          })
        },
        require.resolve('@mdx-js/loader')
      ]
    },

    mjs: {
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false
      }
    },

    graphql: {
      test: /\.graphql?$/,
      use: require.resolve('webpack-graphql-loader')
    },

    tsx: {
      test: /\.tsx$/,
      use: {
        loader: require.resolve('babel-loader'),
        options: createBabelPresets({
          isNodejs: !!conf.nodejs,
          framework: 'react',
          isomorphic: conf.__isIsomorphic,
          typescript: true
        })
      },
    },

    ts: {
      test: /\.ts$/,
      use: {
        loader: require.resolve('babel-loader'),
        options: createBabelPresets({
          isNodejs: !!conf.nodejs,
          isomorphic: true,
          typescript: true
        })
      }
    },

    shaders: {
      test: /\.(glsl|vs|fs)$/,
      use: require.resolve('shader-loader')
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
          options: createBabelPresets({
            isNodejs: !!conf.nodejs,
            framework: 'react',
            isomorphic: conf.__isIsomorphic,
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
          options: createBabelPresets({
            isNodejs: !!conf.nodejs,
          })
        }
      ]
    },

    node: {
      test: /\.node$/,
      use: require.resolve('node-loader')
    },

    video: {
      test: /\.(mp4|webm|ogg|mp3|avi|mov|wav)$/,
      use: fileLoader.video
    },

    pdf: {
      test: /\.pdf$/,
      use: fileLoader.pdf
    },

    images: {
      test: /\.(jpe?g|png|gif|webp)$/i,
      use: fileLoader.images
    },

    fonts: {
      test: /\.(eot|ttf|woff|woff2)$/,
      use: fileLoader.fonts
    },

    html: {
      test: /\.html$/,
      use: require.resolve('html-loader'),
      exclude: /\.async\.(html|css)$/
    },

    markdown: {
      test: /\.md$/,
      use: [
        require.resolve('html-loader'),
        require.resolve('markdown-loader')
      ]
    },

    svgJSX: {
      test: /\.component\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: [{
        loader: require.resolve('babel-loader'),
        options: createBabelPresets({
          isNodejs: !!conf.nodejs,
          framework: 'react',
          isomorphic: conf.__isIsomorphic,
        })
      }, {
        loader: require.resolve('@svgr/webpack')
      }]
    },

    svg: {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        fileLoader.svg,
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

    wasm: {
      test: /\.wasm(\.js)$/,
      use: require.resolve('wasm-loader')
    }
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
