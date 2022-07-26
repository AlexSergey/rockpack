const createBabelPresets = require('@rockpack/babel');
const babelJest = require('babel-jest').default;

const opts = createBabelPresets({
  framework: 'react',
  isTest: true,
  isomorphic: true,
  typescript: true,
});

module.exports = babelJest.createTransformer({ ...opts });
