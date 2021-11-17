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
    { from: path.resolve(__dirname, './readme_assets'), to: './readme_assets' }
  ]
}, (finalConfig, modules, plugins) => {
  if (process.env.NODE_ENV === 'production') {
    finalConfig.output.publicPath = './';
    plugins.set('WebpackShellPluginNext', new WebpackShellPluginNext({
      onBuildExit: {
        scripts: ['echo "Pre-render docs was ended"'],
        blocking: false,
        parallel: false
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
