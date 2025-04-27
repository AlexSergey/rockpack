const { makeConfig } = require('@rockpack/codestyle/index.js');

const config = makeConfig();

config.push({
  ignores: ['**/global.declaration.ts'],
});

module.exports = config;
