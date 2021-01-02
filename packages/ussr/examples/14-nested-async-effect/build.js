const path = require('path');
const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('../../../compiler');

const alias = {
  alias: {
    'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    react: path.resolve(__dirname, './node_modules/react'),
    'react-dom/server': path.resolve(__dirname, './node_modules/react-dom/server')
  }
};

isomorphicCompiler(
  frontendCompiler({
    src: 'src/client.jsx',
    dist: 'public',
    babel: {
      plugins: [
        '@rockpack/babel-plugin-ussr-marker'
      ]
    },
  }, config => {
    Object.assign(config.resolve, alias);
  }),
  backendCompiler({
    src: 'src/server.jsx',
    dist: 'dist',
    babel: {
      plugins: [
        '@rockpack/babel-plugin-ussr-marker'
      ]
    },
  }, config => {
    Object.assign(config.resolve, alias);
  })
);
