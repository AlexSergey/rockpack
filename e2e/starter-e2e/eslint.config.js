const { makeConfig } = require('@rockpack/codestyle');
const { globalIgnores } = require('eslint/config');
const config = makeConfig();

config.push({
  rules: {
    'no-console': 'off',
    'package-json/require-type': 'off',
    'package-json/valid-description': 'off',
  },
});

config.push(globalIgnores(['./src/generators']));

module.exports = config;
