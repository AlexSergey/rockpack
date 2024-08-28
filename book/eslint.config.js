const { makeConfig } = require('@rockpack/codestyle');

const config = makeConfig();

config.push({
  ignores: ['**/global.declaration.ts'],
});

module.exports = config;
