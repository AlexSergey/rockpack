const compileWebpackConfig = (finalConfig, conf, mode, root, modules, plugins) => {
  const webpackConfig = {};

  Object.keys(finalConfig).forEach((p) => {
    webpackConfig[p] = finalConfig[p];
  });

  if (modules) {
    webpackConfig.module = {};
    webpackConfig.module.rules = modules.get();
  }

  if (plugins) {
    webpackConfig.plugins = {};
    webpackConfig.plugins = plugins.get();
  }

  return webpackConfig;
};

module.exports = compileWebpackConfig;
