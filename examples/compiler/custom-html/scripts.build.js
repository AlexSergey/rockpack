const { frontendCompiler } = require('@rockpack/compiler');
const path = require('path');

frontendCompiler({
  banner: true,
  html: {
    code: process.env.SUPER_DEBUG ? `window.SUPER_DEBUG = '${process.env.SUPER_DEBUG}';` : null,
    favicon: path.resolve(__dirname, './favicon.ico'),
    template: path.resolve(__dirname, './index.ejs'),
  },
  styles: 'style.css',
});
