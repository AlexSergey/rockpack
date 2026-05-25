const { frontendCompiler } = require('@rockpack/compiler');
const path = require('path');

frontendCompiler({}, (config) => {
  Object.assign(config.resolve, {
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
    },
  });
});
