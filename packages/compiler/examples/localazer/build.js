const path = require('path');
const { frontendCompiler } = require('../../index');

const alias = {
  alias: {
    'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    react: path.resolve(__dirname, './node_modules/react'),
    'react-dom/server': path.resolve(__dirname, './node_modules/react-dom/server')
  }
};

frontendCompiler({
  url: './'
}, config => {
  Object.assign(config.resolve, alias);
});
