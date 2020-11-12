const { isArray } = require('valid-types');
const TerserPlugin = require('terser-webpack-plugin');

const makeOptimization = (mode, conf) => {
  const optimization = {};

  if (mode === 'development') {
    Object.assign(optimization, {
      moduleIds: 'named',
      chunkIds: 'named',
      nodeEnv: mode,
      flagIncludedChunks: false,
      concatenateModules: false,
      splitChunks: {
        hidePathInfo: false,
        minSize: 10000,
        maxAsyncRequests: Infinity,
        maxInitialRequests: Infinity,
      },
      emitOnErrors: true,
      checkWasmTypes: false,
      minimize: false,
      removeAvailableModules: false
    });
  }

  if (mode === 'production') {
    Object.assign(optimization, {
      moduleIds: 'size',
      chunkIds: 'total-size',
      nodeEnv: mode,
      flagIncludedChunks: true,
      concatenateModules: true,
      splitChunks: {
        hidePathInfo: true,
        minSize: 30000,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
      },
      emitOnErrors: false,
      checkWasmTypes: true,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          sourceMap: conf.debug,
          terserOptions: {
            mangle: true,
            output: {
              comments: new RegExp('banner')
            },
            compress: {
              drop_console: !conf.debug,
              drop_debugger: !conf.debug
            }
          }
        })
      ],
      removeAvailableModules: true,
      removeEmptyChunks: true,
      usedExports: true,
      sideEffects: true
    });
  }

  if (isArray(conf.vendor)) {
    Object.assign(optimization.splitChunks, {
      cacheGroups: {
        defaultVendors: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true
        },
      }
    });
  }

  return optimization;
};

module.exports = makeOptimization;
