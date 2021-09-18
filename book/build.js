const path = require('path');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const { frontendCompiler } = require('@rockpack/compiler');
const prerenderDocgen = require('./postrender');

frontendCompiler({
  dist: path.resolve(__dirname, '../docs'),
  html: {
    template: path.resolve(__dirname, './index.ejs'),
    favicon: path.resolve(__dirname, './favicon.ico')
  },
  copy: [
    { from: path.resolve(__dirname, './readme_assets'), to: './readme_assets' },
    { from: path.resolve(__dirname, './_config.yml'), to: './' }
  ]
}, (finalConfig, modules, plugins) => {
  if (process.env.NODE_ENV === 'production') {
    plugins.set('WebpackShellPluginNext', new WebpackShellPluginNext({
      onBuildExit: {
        scripts: ['echo "Pre-render docs was ended"'],
        blocking: false,
        parallel: true
      }
    }));
    prerenderDocgen(plugins, finalConfig, {
      sections: [
        { url: '/' },
      ],
      languages: {}
    });
  }
});
