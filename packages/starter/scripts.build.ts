import { sourceCompiler } from '@rockpack/compiler';

void sourceCompiler({
  esm: {
    dist: './lib',
    src: './src',
  },
  src: './src/bin/index.ts',
  types: './types',
});
