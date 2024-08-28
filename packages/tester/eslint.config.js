const { makeConfig } = require('@rockpack/codestyle');

const config = makeConfig();

config.push({
  ignores: ['examples/**'],
});

module.exports = config;
