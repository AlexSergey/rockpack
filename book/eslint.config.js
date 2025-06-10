const { makeConfig } = require('@rockpack/codestyle/index.js');

const config = makeConfig();

config.push({
  ignores: ['**/global.declaration.ts'],
  rules: {
    'package-json/require-type': 'off',
  },
});

module.exports = config;
