const { existsSync } = require('fs');
const path = require('path');
const { isString, isBoolean } = require('valid-types');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pathToTSConf = require('./pathToTSConf');

const getPostcssConfig = (root) => {
  const pth = existsSync(path.resolve(root, './postcss.config.js')) ? path.resolve(root, './postcss.config.js') :
    path.resolve(__dirname, '../configs/postcss.config.js');

  return {
    path: pth
  };
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

  const tsConfig = pathToTSConf(root, mode, debug, conf);

  const isTypeScript = isString(tsConfig);

  let cssModules;
  let scssModules;
  let lessModules;

  let css;
  let scss;
  let less;

  if (conf.makePO) {
    extractStyles = false;
  }

  if (conf.__isIsomorphicStyles) {
    /*
    * Don't extract styles from isomorphic backend
    * If mode is development it will be saved on HDD
    * */
    const _extractStyles = extractStyles;

    if (conf.__isIsomorphicBackend) {
      extractStyles = false;
    } else if (mode === 'development') {
      extractStyles = true;
    }

    css = [
      extractStyles ? MiniCssExtractPlugin.loader :
        { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
      { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } }
    ];
    scss = [
      extractStyles ? MiniCssExtractPlugin.loader :
        { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
      { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
      { loader: require.resolve('sass-loader'), options: { sourceMap: debug } }
    ];
    less = [
      extractStyles ? MiniCssExtractPlugin.loader :
        { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
      { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
      { loader: require.resolve('less-loader'), options: { sourceMap: debug, javascriptEnabled: true } }
    ];

    if (!conf.__isIsomorphicBackend) {
      extractStyles = _extractStyles;
    }

    cssModules = [
      extractStyles ? MiniCssExtractPlugin.loader :
        { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
      { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } }
    ];
    scssModules = [
      extractStyles ? MiniCssExtractPlugin.loader :
        { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
      { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
      { loader: require.resolve('sass-loader'), options: { sourceMap: debug } }
    ];
    lessModules = [
      extractStyles ? MiniCssExtractPlugin.loader :
        { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
      { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
      { loader: require.resolve('less-loader'), options: { sourceMap: debug, javascriptEnabled: true } }
    ];
  } else {
    css = [
      extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
      { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } }
    ];
    scss = [
      extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
      { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
      { loader: require.resolve('sass-loader'), options: { sourceMap: debug } }
    ];
    less = [
      extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug } },
      { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
      { loader: require.resolve('less-loader'), options: { sourceMap: debug, javascriptEnabled: true } }
    ];

    cssModules = [
      extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
      { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } }
    ];
    scssModules = [
      extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
      { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
      { loader: require.resolve('sass-loader'), options: { sourceMap: debug } }
    ];
    lessModules = [
      extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
      { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
      { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
      { loader: require.resolve('less-loader'), options: { sourceMap: debug, javascriptEnabled: true } }
    ];
  }

  if (isTypeScript) {
    if (conf.__isIsomorphicStyles) {
      cssModules = [
        extractStyles ? MiniCssExtractPlugin.loader :
          { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
        { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
        { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
        { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } }
      ];
      scssModules = [
        extractStyles ? MiniCssExtractPlugin.loader :
          { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
        { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
        { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
        { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
        { loader: require.resolve('sass-loader'), options: { sourceMap: debug } }
      ];
      lessModules = [
        extractStyles ? MiniCssExtractPlugin.loader :
          { loader: require.resolve('isomorphic-style-loader'), options: { sourceMap: debug } },
        { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
        { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
        { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
        { loader: require.resolve('less-loader'), options: { sourceMap: debug, javascriptEnabled: true } }
      ];
    } else {
      cssModules = [
        extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
        { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
        { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
        { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } }
      ];
      scssModules = [
        extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
        { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
        { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
        { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
        { loader: require.resolve('sass-loader'), options: { sourceMap: debug } }
      ];
      lessModules = [
        extractStyles ? MiniCssExtractPlugin.loader : { loader: require.resolve('style-loader') },
        { loader: require.resolve('@teamsupercell/typings-for-css-modules-loader') },
        { loader: require.resolve('css-loader'), options: { sourceMap: debug, modules: true } },
        { loader: require.resolve('postcss-loader'), options: { config: getPostcssConfig(root), sourceMap: debug } },
        { loader: require.resolve('less-loader'), options: { sourceMap: debug, javascriptEnabled: true } }
      ];
    }
  }

  return {
    css: {
      simple: css,
      modules: cssModules
    },
    scss: {
      simple: scss,
      modules: scssModules
    },
    less: {
      simple: less,
      modules: lessModules
    }
  };
};

module.exports = getStylesRules;