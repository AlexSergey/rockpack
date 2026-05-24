const path = require('path');

const { backendCompiler } = require('../../src');

backendCompiler({}, (finalConfig) => {
  Object.assign(finalConfig.resolve, {
    alias: {
      text: path.resolve('./text'),
    },
  });
});
