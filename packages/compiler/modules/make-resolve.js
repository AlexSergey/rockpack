const path = require('node:path');

const makeResolve = (root) => {
  return {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
    modules: [path.resolve(root, 'node_modules'), 'node_modules'],
  };
};

module.exports = makeResolve;
