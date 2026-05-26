import { backendCompiler, frontendCompiler, isomorphicCompiler } from '@rockpack/compiler';

void isomorphicCompiler(
  backendCompiler({
    src: 'src/server.tsx',
  }),
  frontendCompiler({
    src: 'src/client.tsx',
  }),
);
