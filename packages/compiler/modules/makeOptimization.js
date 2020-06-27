const makeOptimization = (mode, conf) => {
  const optimization = {};

  if (conf.vendor) {
    Object.assign(optimization, {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'initial',
            name: 'vendor',
            test: 'vendor',
            enforce: true
          },
        }
      }
    });
  }

  if (mode === 'development') {
    Object.assign(optimization, {
      namedModules: true,
      namedChunks: true,
      nodeEnv: 'development',
      flagIncludedChunks: false,
      occurrenceOrder: false,
      concatenateModules: false,
      splitChunks: {
        hidePathInfo: false,
        minSize: 10000,
        maxAsyncRequests: Infinity,
        maxInitialRequests: Infinity,
      },
      noEmitOnErrors: false,
      checkWasmTypes: false,
      minimize: false,
      removeAvailableModules: false
    });
  }

  if (mode === 'production') {
    Object.assign(optimization, {
      namedModules: false,
      namedChunks: false,
      nodeEnv: 'production',
      flagIncludedChunks: true,
      occurrenceOrder: true,
      concatenateModules: true,
      splitChunks: {
        hidePathInfo: true,
        minSize: 30000,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
      },
      noEmitOnErrors: true,
      checkWasmTypes: true,
      minimize: true,
      removeAvailableModules: true,
      removeEmptyChunks: true,
      usedExports: true,
      sideEffects: true
    });
  }

  return optimization;
};

module.exports = makeOptimization;
