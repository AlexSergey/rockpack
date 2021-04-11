const { rockConfig } = require('@rockpack/codestyle');

module.exports = rockConfig({
  '@typescript-eslint/return-await': 'off',
  '@typescript-eslint/camelcase': 'off',
  'no-console': 'off'
}, {
  globals: {
    JSX: true,
    NodeJS: true
  }
});
