const { makeConfig } = require('@rockpack/codestyle');

module.exports = makeConfig(
  {},
  {
    camelCaseAllow: ['role_id', 'plural_forms', 'locale_data'],
  },
);
