const { makeConfig } = require('@rockpack/codestyle');

const camelCaseAllow = ['download_url'];

const config = makeConfig();

config.push({
  rules: {
    camelcase: ['error', { allow: camelCaseAllow, properties: 'always' }],
  },
});

module.exports = config;
