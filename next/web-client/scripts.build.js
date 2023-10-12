const path = require('node:path');
const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rockpack/compiler');

isomorphicCompiler(
  frontendCompiler({
    src: 'src/client.tsx',
    dist: 'public',
    copy: [
      { from: path.resolve(__dirname, './src/assets/favicon.ico'), to: './' },
      { from: path.resolve(__dirname, './src/assets/robots.txt'), to: './' },
      { from: path.resolve(__dirname, './src/locales'), to: './locales' },
    ],
  }),
  backendCompiler({
    src: 'src/server.tsx',
    dist: 'dist',
  }),
);
