const { rockConfig } = require('@rockpack/codestyle');

module.exports = rockConfig({
  'react/function-component-definition': 0
}, {
  globals: {
    JSX: true
  }
});
