const path = require('path');
const { frontendCompiler } = require('../../compiler');

frontendCompiler(null, config => {
  Object.assign(config.resolve, {
    alias: {
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      react: path.resolve(__dirname, './node_modules/react')
    }
  });
});
