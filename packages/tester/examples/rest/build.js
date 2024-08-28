const path = require('path');

const { frontendCompiler } = require('../../../compiler');

frontendCompiler({}, (config) => {
  Object.assign(config.resolve, {
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
    },
  });
});
