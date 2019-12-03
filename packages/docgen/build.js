const { frontendCompiler } = require('rocket-starter');
const { resolve } = require('path');

frontendCompiler({}, config => {
  Object.assign(config.resolve, {
    alias: {
      assets: resolve(__dirname, './lib/assets')
    }
  });
});
