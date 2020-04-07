const { libraryCompiler } = require('../../index');

libraryCompiler({
  name: 'app',
  cjs: {
    src: './src',
    dist: './lib/cjs'
  },
  esm: {
    src: './src',
    dist: './lib/esm'
  }
});
