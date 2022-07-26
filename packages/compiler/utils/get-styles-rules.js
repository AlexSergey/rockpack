const { existsSync } = require('node:fs');
const path = require('node:path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { isString, isBoolean } = require('valid-types');

const pathToTSConf = require('./path-to-ts-conf');

const getPostcssConfig = (root) => {
  const pth = existsSync(path.resolve(root, './postcss.config.js'))
    ? path.resolve(root, './postcss.config.js')
    : path.resolve(__dirname, '../configs/postcss.config.js');

  // eslint-disable-next-line global-require,import/no-dynamic-require
  return require(pth);
};

const getStylesRules = (conf, mode, root) => {
  const isProduction = mode === 'production';

  let extractStyles = false;

  if (isProduction) {
    extractStyles = isBoolean(conf.styles) && conf.styles === false ? conf.styles : true;
  }

  let debug = false;

  if (!isProduction) {
    debug = true;
  }
  if (conf.debug) {
    debug = true;
  }

  const tsConfig = pathToTSConf(root, mode, debug);

  const isTypeScript = isString(tsConfig);

  let cssModule;
  let scssModule;
  let lessModule;

  let css;
  let scss;
  let less;

  if (conf.__isIsomorphicStyles) {
    css = [
      MiniCssExtractPlugin.loader,
      { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
      {
        loader: require.resolve('postcss-loader'),
        options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
      },
    ];
    scss = [
      MiniCssExtractPlugin.loader,
      { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
      {
        loader: require.resolve('postcss-loader'),
        options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
      },
      { loader: require.resolve('sass-loader'), options: { sourceMap: debug } },
    ];
    less = [
      MiniCssExtractPlugin.loader,
      { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
      {
        loader: require.resolve('postcss-loader'),
        options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
      },
      {
        loader: require.resolve('less-loader'),
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
          sourceMap: debug,
        },
      },
    ];

    cssModule = [
      MiniCssExtractPlugin.loader,
      { loader: require.resolve('css-loader'), options: { modules: true, sourceMap: debug } },
      {
        loader: require.resolve('postcss-loader'),
        options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
      },
    ];
    scssModule = [
      MiniCssExtractPlugin.loader,
      { loader: require.resolve('css-loader'), options: { modules: true, sourceMap: debug } },
      {
        loader: require.resolve('postcss-loader'),
        options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
      },
      { loader: require.resolve('sass-loader'), options: { sourceMap: debug } },
    ];
    lessModule = [
      MiniCssExtractPlugin.loader,
      { loader: require.resolve('css-loader'), options: { modules: true, sourceMap: debug } },
      {
        loader: require.resolve('postcss-loader'),
        options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
      },
      {
        loader: require.resolve('less-loader'),
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
          sourceMap: debug,
        },
      },
    ];
  } else {
    css = [
      extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
      {
        loader: require.resolve('postcss-loader'),
        options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
      },
    ];
    scss = [
      extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
      {
        loader: require.resolve('postcss-loader'),
        options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
      },
      { loader: require.resolve('sass-loader'), options: { sourceMap: debug } },
    ];
    less = [
      extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
      {
        loader: require.resolve('postcss-loader'),
        options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
      },
      {
        loader: require.resolve('less-loader'),
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
          sourceMap: debug,
        },
      },
    ];

    cssModule = [
      extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
      { loader: require.resolve('css-loader'), options: { modules: true, sourceMap: debug } },
      {
        loader: require.resolve('postcss-loader'),
        options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
      },
    ];
    scssModule = [
      extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
      { loader: require.resolve('css-loader'), options: { modules: true, sourceMap: debug } },
      {
        loader: require.resolve('postcss-loader'),
        options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
      },
      { loader: require.resolve('sass-loader'), options: { sourceMap: debug } },
    ];
    lessModule = [
      extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
      { loader: require.resolve('css-loader'), options: { modules: true, sourceMap: debug } },
      {
        loader: require.resolve('postcss-loader'),
        options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
      },
      {
        loader: require.resolve('less-loader'),
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
          sourceMap: debug,
        },
      },
    ];
  }

  if (isTypeScript) {
    if (conf.__isIsomorphicStyles) {
      cssModule = [
        MiniCssExtractPlugin.loader,
        { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
        { loader: require.resolve('css-loader'), options: { modules: true, sourceMap: debug } },
        {
          loader: require.resolve('postcss-loader'),
          options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
        },
      ];
      scssModule = [
        MiniCssExtractPlugin.loader,
        { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
        { loader: require.resolve('css-loader'), options: { modules: true, sourceMap: debug } },
        {
          loader: require.resolve('postcss-loader'),
          options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
        },
        { loader: require.resolve('sass-loader'), options: { sourceMap: debug } },
      ];
      lessModule = [
        MiniCssExtractPlugin.loader,
        { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
        { loader: require.resolve('css-loader'), options: { modules: true, sourceMap: debug } },
        {
          loader: require.resolve('postcss-loader'),
          options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
        },
        {
          loader: require.resolve('less-loader'),
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
            sourceMap: debug,
          },
        },
      ];
    } else {
      cssModule = [
        extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
        { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
        { loader: require.resolve('css-loader'), options: { modules: true, sourceMap: debug } },
        {
          loader: require.resolve('postcss-loader'),
          options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
        },
      ];
      scssModule = [
        extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
        { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
        { loader: require.resolve('css-loader'), options: { modules: true, sourceMap: debug } },
        {
          loader: require.resolve('postcss-loader'),
          options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
        },
        { loader: require.resolve('sass-loader'), options: { sourceMap: debug } },
      ];
      lessModule = [
        extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
        { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
        { loader: require.resolve('css-loader'), options: { modules: true, sourceMap: debug } },
        {
          loader: require.resolve('postcss-loader'),
          options: { postcssOptions: getPostcssConfig(root), sourceMap: debug },
        },
        {
          loader: require.resolve('less-loader'),
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
            sourceMap: debug,
          },
        },
      ];
    }
  }

  return {
    css: {
      module: cssModule,
      simple: css,
    },
    less: {
      module: lessModule,
      simple: less,
    },
    scss: {
      module: scssModule,
      simple: scss,
    },
  };
};

module.exports = getStylesRules;
