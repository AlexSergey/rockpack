const { makeConfig } = require('@rockpack/codestyle/index.js');

const camelCaseAllow = ['download_url'];

const config = makeConfig();

config.push({
  rules: {
    camelcase: ['error', { allow: camelCaseAllow, properties: 'always' }],
  },
});

module.exports = config;
