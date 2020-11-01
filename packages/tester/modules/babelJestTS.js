const babelJest = require('babel-jest');
const createBabelPresets = require('@rockpack/babel');

const opts = createBabelPresets({
  typescript: true,
  isomorphic: true,
  framework: 'react',
  isTest: true
});

module.exports = babelJest.createTransformer(Object.assign({}, opts));
