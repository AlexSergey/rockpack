import { sourceCompiler } from '@rockpack/compiler';

void sourceCompiler({
  cjs: {
    dist: './lib/cjs',
    src: './src',
  },
  esm: {
    dist: './lib/esm',
    src: './src',
  },
  src: './src/index.ts',
  types: './types',
});
