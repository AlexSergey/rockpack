const path = require('node:path');

const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rockpack/compiler');

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
