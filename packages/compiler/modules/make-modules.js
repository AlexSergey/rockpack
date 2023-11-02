const createBabelPresets = require('@rockpack/babel');

const createAssetType = require('../utils/asset-type');
const Collection = require('../utils/collection');
const getStylesRules = require('../utils/get-styles-rules');

// eslint-disable-next-line default-param-last
function getModules(conf = {}, mode, root) {
  const { css, scss, less } = getStylesRules(conf, mode, root);
  let presetsAdditionalOptions = {};
  if (conf.babelPresetsAdditionalOptions) {
    presetsAdditionalOptions = conf.babelPresetsAdditionalOptions;
  }

  const assetType = createAssetType(conf);

  return {
    asyncAssets: {
      ...{
        test: /\.async\.(html|css)$/,
        use: [require.resolve('extract-loader')],
      },
      ...assetType.asyncAssets,
    },

    css: {
      exclude: /(\.async\.css$)|(\.module\.css$)/,
      test: /\.css$/,
      use: css.simple,
    },

    cssModules: {
      exclude: /\.async\.css$/,
      test: /\.module\.css$/,
      use: css.module,
    },

    fonts: {
      ...{
        test: /\.(eot|ttf|woff|woff2)$/,
      },
      ...assetType.fonts,
    },

    graphql: {
      test: /\.graphql?$/,
      use: require.resolve('webpack-graphql-loader'),
    },

    handlebars: {
      test: /\.(hbs|handlebars)$/,
      use: require.resolve('handlebars-loader'),
    },

    html: {
      exclude: /\.async\.(html|css)$/,
      test: /\.html$/,
      // eslint-disable-next-line sonarjs/no-duplicate-string
      use: require.resolve('html-loader'),
    },

    images: {
      ...{
        test: /\.(jpe?g|png|gif|webp)$/i,
      },
      ...assetType.images,
    },

    jade: {
      test: /\.(pug|jade)$/,
      use: [require.resolve('html-loader'), require.resolve('pug-plain-loader')],
    },

    js: {
      exclude: /(node_modules|bower_components)/,
      test: /\.js$/,
      use: [
        {
          // eslint-disable-next-line sonarjs/no-duplicate-string
          loader: require.resolve('babel-loader'),
          options: createBabelPresets({
            isNodejs: !!conf.nodejs,
            presetsAdditionalOptions,
          }),
        },
      ],
    },

    jsx: {
      exclude: /(node_modules|bower_components)/,
      test: /\.jsx$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: createBabelPresets({
            framework: 'react',
            isNodejs: !!conf.nodejs,
            isomorphic: conf.__isIsomorphic,
            presetsAdditionalOptions,
          }),
        },
      ],
    },

    less: {
      exclude: /\.module\.less$/,
      test: /\.less$/,
      use: less.simple,
    },

    lessModules: {
      test: /\.module\.less$/,
      use: less.module,
    },

    markdown: {
      test: /\.md$/,
      use: [require.resolve('html-loader'), require.resolve('markdown-loader')],
    },

    mdx: {
      exclude: /(node_modules|bower_components)/,
      test: /\.mdx$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: createBabelPresets({
            framework: 'react',
            isNodejs: !!conf.nodejs,
            isomorphic: conf.__isIsomorphic,
            presetsAdditionalOptions,
          }),
        },
        require.resolve('@mdx-js/loader'),
      ],
    },

    mjs: {
      include: /node_modules/,
      resolve: {
        fullySpecified: false,
      },
      test: /\.mjs$/,
      type: 'javascript/auto',
    },

    node: {
      test: /\.node$/,
      use: require.resolve('node-loader'),
    },

    pdf: {
      ...{
        test: /\.pdf$/,
      },
      ...assetType.pdf,
    },

    scss: {
      exclude: /\.module\.scss$/,
      test: /\.scss$/,
      use: scss.simple,
    },

    scssModules: {
      test: /\.module\.scss$/,
      use: scss.module,
    },

    shaders: {
      test: /\.(glsl|vs|fs)$/,
      use: require.resolve('shader-loader'),
    },

    svg: {
      ...{
        exclude: /\.component\.svg(\?v=\d+\.\d+\.\d+)?$/,
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: require.resolve('svgo-loader'),
            options: {
              name: 'preset-default',
              params: {
                overrides: {
                  convertColors: {
                    params: {
                      shorthex: false,
                    },
                  },
                  convertPathData: false,
                  removeTitle: true,
                },
              },
            },
          },
        ],
      },
      ...assetType.svg,
    },

    svgJSX: {
      test: /\.component\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: createBabelPresets({
            framework: 'react',
            isNodejs: !!conf.nodejs,
            isomorphic: conf.__isIsomorphic,
            presetsAdditionalOptions,
          }),
        },
        {
          loader: require.resolve('@svgr/webpack'),
        },
      ],
    },

    ts: {
      test: /\.ts$/,
      use: {
        loader: require.resolve('babel-loader'),
        options: createBabelPresets({
          isNodejs: !!conf.nodejs,
          isomorphic: true,
          presetsAdditionalOptions,
          typescript: true,
        }),
      },
    },

    tsx: {
      test: /\.tsx$/,
      use: {
        loader: require.resolve('babel-loader'),
        options: createBabelPresets({
          framework: 'react',
          isNodejs: !!conf.nodejs,
          isomorphic: conf.__isIsomorphic,
          presetsAdditionalOptions,
          typescript: true,
        }),
      },
    },

    video: {
      ...{
        test: /\.(mp4|webm|ogg|mp3|avi|mov|wav)$/,
      },
      ...assetType.video,
    },

    wasm: {
      test: /\.wasm(\.js)$/,
      use: require.resolve('wasm-loader'),
    },
  };
}

const _makeModules = (modules, conf, excludeModules = []) => {
  excludeModules.forEach((propsToDelete) => {
    // eslint-disable-next-line no-param-reassign
    delete modules[propsToDelete];
  });

  return new Collection({
    data: modules,
    props: {},
  });
};

const makeModules = (conf, root, packageJson, mode, excludeModules) => {
  const modules = getModules(conf, mode, root);

  return _makeModules(modules, conf, excludeModules);
};

module.exports = makeModules;
