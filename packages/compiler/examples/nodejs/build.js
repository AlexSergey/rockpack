const path = require('path');
const { backendCompiler } = require('../../index');

backendCompiler({}, finalConfig => {
  Object.assign(finalConfig.resolve, {
    alias: {
      text: path.resolve('./text')
    }
  });
});
