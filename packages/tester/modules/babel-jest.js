const createBabelPresets = require('@rockpack/babel');
const babelJest = require('babel-jest').default;

const opts = createBabelPresets({
  framework: 'react',
  isTest: true,
  isomorphic: true,
});

module.exports = babelJest.createTransformer({ ...opts });
