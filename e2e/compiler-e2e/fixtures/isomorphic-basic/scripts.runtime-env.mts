import { isomorphicCompiler } from '@rockpack/compiler';

void isomorphicCompiler({
  backend: { dist: 'dist', env: { runtime: true }, src: 'src/server.tsx' },
  frontend: { dist: 'public', src: 'src/client.tsx' },
});
