const createBabelPresets = require('@rockpack/babel');
const babelJest = require('babel-jest').default;

const opts = createBabelPresets({
  framework: 'react',
  isomorphic: true,
  isTest: true,
});

module.exports = babelJest.createTransformer({ ...opts });
