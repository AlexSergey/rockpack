const path = require('path');
const { frontendCompiler } = require('../../index');

frontendCompiler({
  banner: true,
  styles: 'style.css',
  html: {
    template: path.resolve(__dirname, './index.ejs'),
    code: process.env.SUPER_DEBUG ? `window.SUPER_DEBUG = '${process.env.SUPER_DEBUG}';` : null,
    favicon: path.resolve(__dirname, './favicon.ico')
  },
});
