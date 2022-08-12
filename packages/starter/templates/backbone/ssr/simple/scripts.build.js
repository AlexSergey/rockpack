const path = require('node:path');

const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rockpack/compiler');

isomorphicCompiler(
  frontendCompiler({
    copy: [
      { from: path.resolve(__dirname, './src/assets/favicon.ico'), to: './' },
      { from: path.resolve(__dirname, './robots.txt'), to: './' },
    ],
    dist: 'public',
    src: 'src/client.jsx',
  }),
  backendCompiler({
    dist: 'dist',
    src: 'src/server.jsx',
  }),
);
