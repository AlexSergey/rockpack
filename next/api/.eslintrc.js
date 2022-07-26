const { makeConfig } = require('@rockpack/codestyle');

module.exports = makeConfig(
  {},
  {
    camelCaseAllow: ['role_id', 'user_id', 'post_id', 'type_id', 'entity_id'],
  },
);
