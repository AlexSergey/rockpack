import { isomorphicCompiler } from '@rockpack/compiler';

void isomorphicCompiler({
  backend: {
    src: 'src/server.tsx',
  },
  frontend: {
    dist: 'public',
    src: 'src/client.tsx',
  },
});
