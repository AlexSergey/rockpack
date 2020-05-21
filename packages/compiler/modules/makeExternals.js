const nodeExternals = require('webpack-node-externals');
const getNodeModules = require('../utils/getNodeModules');

const makeExternals = (conf, root) => (
  conf.__isBackend && !conf.__isIsomorphicBackend ?
    getNodeModules(root)
      .map(pth => nodeExternals({
        modulesDir: pth
      })) :
    []
);

module.exports = makeExternals;
