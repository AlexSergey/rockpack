const MakePotPlugin = require('@localazer/webpack-plugin');
const { frontendCompiler } = require('@rockpack/compiler');
const path = require('path');

const alias = {
  alias: {
    react: path.resolve(__dirname, '../../node_modules/react'),
    'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
    'react-dom/server': path.resolve(__dirname, '../../node_modules/react-dom/server'),
  },
};

frontendCompiler(
  {
    copy: [
      { from: path.resolve(__dirname, './src/assets/favicon.ico'), to: './' },
      { from: path.resolve(__dirname, './src/assets/robots.txt'), to: './' },
      { from: path.resolve(__dirname, './src/locales'), to: './locales' },
    ],
    dist: 'public',
    src: 'src/client.tsx',
  },
  (config, modules, plugins) => {
    Object.assign(config.resolve, alias);

    plugins.set(
      'MakePotPlugin',
      new MakePotPlugin({
        dist: './locales',
      }),
    );
  },
);
