const nodeExternals = require('webpack-node-externals');

const getNodeModules = require('../utils/get-node-modules');

const makeExternals = (conf, root) =>
  conf.__isBackend && !conf.__isIsomorphicBackend
    ? nodeExternals({
        additionalModuleDirs: getNodeModules(root),
      })
    : [];

module.exports = makeExternals;
