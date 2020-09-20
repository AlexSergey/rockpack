const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rockpack/compiler');

isomorphicCompiler(
  frontendCompiler({
    src: 'src/client.tsx',
    dist: 'public',
  }),
  backendCompiler({
    src: 'src/server.tsx',
    dist: 'dist',
  })
);
