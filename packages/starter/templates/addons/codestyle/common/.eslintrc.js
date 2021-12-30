const { cleanConfig } = require('@rockpack/codestyle');

module.exports = cleanConfig({
  'react/function-component-definition': [2, {
    namedComponents: 'arrow-function',
    unnamedComponents: 'arrow-function',
  }],
});
