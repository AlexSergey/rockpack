const { documentationCompiler } = require('../../compiler');
const { resolve } = require('path');

documentationCompiler(null, config => {
  Object.assign(config.resolve, {
    alias: {
      assets: resolve(__dirname, '../lib/assets')
    }
  });
});
