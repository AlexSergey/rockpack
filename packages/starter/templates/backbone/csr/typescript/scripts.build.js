const path = require('path');
const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler({
  styles: 'styles.css',
  vendor: ['react', 'react-dom'],
  html: {
    template: path.resolve(__dirname, './index.ejs'),
    favicon: path.resolve(__dirname, './favicon.ico')
  },
});
