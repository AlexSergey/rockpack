const path = require('path');
const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rock/compiler');

const alias = {
  alias: {
    'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
    react: path.resolve(__dirname, '../node_modules/react'),
    'react-dom/server': path.resolve(__dirname, '../node_modules/react-dom/server')
  }
};

isomorphicCompiler([
  {
    compiler: backendCompiler,
    config: {
      src: 'src/server.tsx',
      dist: 'dist'
    },
    callback: config => {
      Object.assign(config.resolve, alias);
    }
  },
  {
    compiler: frontendCompiler,
    config: {
      src: 'src/client.tsx',
      dist: 'public',
      copy: [
        { from: path.resolve(__dirname, './src/assets/favicon.ico'), to: './' },
        { from: path.resolve(__dirname, './src/assets/robots.txt'), to: './' },
        { from: path.resolve(__dirname, './src/localization/locales'), to: './locales' }
      ]
    },
    callback: config => {
      Object.assign(config.resolve, alias);
    }
  }
]);
