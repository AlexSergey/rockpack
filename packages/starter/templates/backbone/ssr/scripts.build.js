const { backendCompiler, frontendCompiler, isomorphicCompiler } = require('@rockpack/compiler');
const path = require('node:path');

isomorphicCompiler(
  frontendCompiler({
    copy: [
      { from: path.resolve(__dirname, './favicon.ico'), to: './' },
      { from: path.resolve(__dirname, './robots.txt'), to: './' },
    ],
    dist: 'public',
    src: 'src/client.tsx',
  }),
  backendCompiler({
    dist: 'dist',
    src: 'src/server.tsx',
  }),
);
