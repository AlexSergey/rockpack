const { makeConfig } = require('@rockpack/codestyle');

const camelCaseAllow = ['role_id', 'plural_forms', 'locale_data'];

const config = makeConfig();

config.push({
  rules: {
    camelcase: ['error', { allow: camelCaseAllow, properties: 'always' }],
    'no-console': 'off',
  },
});

module.exports = config;
