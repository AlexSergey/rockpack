const { makeConfig } = require('@rockpack/codestyle');

const config = makeConfig();

config.push({
  ignores: ['templates/**'],
});

module.exports = config;
