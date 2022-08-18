const path = require('node:path');

const makeResolve = (root) => {
  const resolve = {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
  };

  if (root) {
    resolve.modules = [path.join(root, 'node_modules'), 'node_modules'];
  }

  return resolve;
};

module.exports = makeResolve;
