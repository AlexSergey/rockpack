const { libraryCompiler } = require('../../src');

libraryCompiler({
  cjs: {
    dist: './lib/cjs',
    src: './src',
  },
  esm: {
    dist: './lib/esm',
    src: './src',
  },
  name: 'Color',
});
