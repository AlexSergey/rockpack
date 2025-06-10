const { makeConfig } = require('@rockpack/codestyle/index.js');

const camelCaseAllow = ['role_id', 'user_id', 'post_id', 'type_id', 'entity_id'];

const config = makeConfig();

config.push({
  rules: {
    camelcase: ['error', { allow: camelCaseAllow, properties: 'always' }],
    'no-console': 'off',
    'package-json/require-type': 'off',
  },
});

module.exports = config;
