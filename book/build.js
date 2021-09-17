const path = require('path');
const { frontendCompiler } = require('@rockpack/compiler');
const prerenderDocgen = require('./postrender');

frontendCompiler({
  dist: path.resolve(__dirname, '../docs'),
  html: {
    template: path.resolve(__dirname, './index.ejs'),
    favicon: path.resolve(__dirname, './favicon.ico')
  },
  copy: [
    { from: path.resolve(__dirname, './readme_assets'), to: './readme_assets' }
  ]
}, (finalConfig, modules, plugins) => {
  if (process.env.NODE_ENV === 'production') {
    prerenderDocgen(plugins, finalConfig, {
      sections: [
        { url: '/' },
      ],
      languages: {}
    });
  }
});
