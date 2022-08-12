const path = require('node:path');

const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler({
  html: {
    favicon: path.resolve(__dirname, './favicon.ico'),
    template: path.resolve(__dirname, './index.ejs'),
  },
  styles: 'styles.css',
  vendor: ['react', 'react-dom'],
});
