import { backendCompiler, frontendCompiler, isomorphicCompiler } from '@rockpack/compiler';

void isomorphicCompiler(
  backendCompiler({
    src: 'src/server.tsx',
  }),
  frontendCompiler({
    dist: 'public',
    src: 'src/client.tsx',
  }),
);
