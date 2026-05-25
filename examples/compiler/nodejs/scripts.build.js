const { backendCompiler } = require('@rockpack/compiler');
const path = require('path');

backendCompiler({}, (finalConfig) => {
  Object.assign(finalConfig.resolve, {
    alias: {
      text: path.resolve('./text'),
    },
  });
});
