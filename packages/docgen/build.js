const { frontendCompiler } = require('../compiler');
const { resolve } = require('path');

frontendCompiler({
    inline: false
}, config => {
  Object.assign(config.resolve, {
    alias: {
      assets: resolve(__dirname, './lib/assets')
    }
  });
});
