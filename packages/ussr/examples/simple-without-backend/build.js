const path = require('path');
const { frontendCompiler } = require('../../../compiler');

frontendCompiler({
  html: {
    template: path.resolve(__dirname, './index.ejs')
  }
},
props => {
  Object.assign(props.resolve, {
    alias: {
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      react: path.resolve(__dirname, './node_modules/react')
    }
  });
});
