const { makeConfig } = require('@rockpack/codestyle');

const config = makeConfig();

config.push({
  rules: {
    'package-json/require-type': 'off',
  },
});

module.exports = config;
