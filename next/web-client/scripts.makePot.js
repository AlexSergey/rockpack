const path = require('path');
const { frontendCompiler } = require('@rockpack/compiler');
const MakePotPlugin = require('@localazer/webpack-plugin');

const alias = {
  alias: {
    'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
    react: path.resolve(__dirname, '../../node_modules/react'),
    'react-dom/server': path.resolve(__dirname, '../../node_modules/react-dom/server')
  }
};

frontendCompiler({
  src: 'src/client.tsx',
  dist: 'public',
  copy: [
    { from: path.resolve(__dirname, './src/assets/favicon.ico'), to: './' },
    { from: path.resolve(__dirname, './src/assets/robots.txt'), to: './' },
    { from: path.resolve(__dirname, './src/locales'), to: './locales' }
  ]
}, (config, modules, plugins) => {
  Object.assign(config.resolve, alias);

  plugins.set('MakePotPlugin', new MakePotPlugin({
    dist: './locales'
  }));
});
