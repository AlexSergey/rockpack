const { backendCompiler, frontendCompiler, isomorphicCompiler } = require('@rockpack/compiler');
const path = require('node:path');

isomorphicCompiler(
  frontendCompiler({
    copy: [
      { from: path.resolve(__dirname, './src/assets/favicon.ico'), to: './' },
      { from: path.resolve(__dirname, './src/assets/robots.txt'), to: './' },
      { from: path.resolve(__dirname, './src/locales'), to: './locales' },
    ],
    dist: 'public',
    src: 'src/client.tsx',
  }),
  backendCompiler({
    dist: 'dist',
    src: 'src/server.tsx',
  }),
);
