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
  if (mode === 'production') {
    Object.assign(optimization, {
      usedExports: true,
      sideEffects: true,
      concatenateModules: true
    });
  }
  
  return optimization;
};

module.exports = makeOptimization;
