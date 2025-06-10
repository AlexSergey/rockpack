const { makeConfig } = require('@rockpack/codestyle/index.js');
const { globalIgnores } = require('eslint/config');
const config = makeConfig();

config.push({
  rules: {
    'package-json/require-type': 'off',
  },
});

config.push(globalIgnores(['./examples']));

module.exports = config;
