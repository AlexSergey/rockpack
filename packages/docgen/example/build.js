const { documentationCompiler } = require('../../compiler');
const { resolve } = require('path');

documentationCompiler({
    debug: true
}, config => {
  Object.assign(config.resolve, {
    alias: {
      assets: resolve(__dirname, '../lib/assets')
    }
  });
});
