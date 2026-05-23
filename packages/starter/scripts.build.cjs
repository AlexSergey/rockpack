const { sourceCompiler } = require('@rockpack/compiler');

sourceCompiler({
  esm: {
    dist: './lib',
    src: './src',
  },
  src: './src/bin/index.ts',
  types: './types',
});
