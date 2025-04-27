const { makeConfig } = require('@rockpack/codestyle/index.js');

const config = makeConfig();

config.push({
  ignores: ['templates/**'],
});

module.exports = config;
