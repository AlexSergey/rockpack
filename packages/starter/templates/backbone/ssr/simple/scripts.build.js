const path = require('path');
const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rockpack/compiler');

isomorphicCompiler(
  frontendCompiler({
    src: 'src/client.jsx',
    dist: 'public',
    copy: [
      { from: path.resolve(__dirname, './favicon.ico'), to: './' }
    ]
  }),
  backendCompiler({
    src: 'src/server.jsx',
    dist: 'dist',
  })
);
