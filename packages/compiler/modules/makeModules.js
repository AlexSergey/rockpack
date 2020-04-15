const { existsSync } = require('fs');
const { isString, isBoolean } = require('valid-types');
const path = require('path');
const createBabelPresets = require('@rock/babel');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const formatter = require('@becklyn/typescript-error-formatter');
const Collection = require('../utils/Collection');
const pathToEslintrc = require('../utils/pathToEslintrc');
const pathToTSConf = require('../utils/pathToTSConf');

const getPostcssConfig = (root) => {
  const pth = existsSync(path.resolve(root, './postcss.config.js')) ? path.resolve(root, './postcss.config.js') :
    path.resolve(__dirname, '../configs/postcss.config.js');
  
  return {
    path: pth
  };
};

function getModules(conf = {}, mode, root) {
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
  
  const finalConf = {
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
          query: createBabelPresets({
            isNodejs: !!conf.nodejs,
            framework: 'react',
            loadable: true,
            isProduction
          })
        },
        {
          loader: require.resolve('ts-loader'),
          options: {
            configFile: isTypeScript ?
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
            configFile: isTypeScript ?
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
          query: createBabelPresets({
            isNodejs: !!conf.nodejs,
            framework: false,
            loadable: true,
            isProduction
          })
        },
        {
          loader: require.resolve('ts-loader'),
          options: {
            configFile: isTypeScript ?
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
            configFile: isTypeScript ?
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
    
    images: conf.inline ? {
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
      test: /\.(jpe?g|png|gif|pdf)$/i,
      use: [
        {
          loader: require.resolve('file-loader'),
          query: {
            name: 'images/[name][hash].[ext]'
          }
        }
      ]
    },
    
    fonts: conf.inline ? {
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
  
    svgJSX: {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      issuer: {
        test: /\.jsx?$/
      },
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
      }, {
        loader: require.resolve('url-loader')
      }]
    },
  
    svg: {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        conf.inline ?
          {
            loader: require.resolve('url-loader')
          } :
          {
            loader: require.resolve('file-loader'),
            options: {
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
      ]
    },
  };
  
  const eslintRc = pathToEslintrc(root, mode);
  
  if (isString(eslintRc)) {
    finalConf.jsPre = {
      enforce: 'pre',
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: [{
        loader: require.resolve('eslint-loader'),
        options: {
          configFile: eslintRc,
          formatter: require.resolve('eslint-formatter-friendly')
        }
      }]
    };
  }
  
  return finalConf;
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
