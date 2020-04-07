const { libraryCompiler } = require('@rock/compiler');

libraryCompiler({
  name: 'RockDocgen',
  cjs: {
    src: './src',
    dist: './lib/cjs'
  },
  esm: {
    src: './src',
    dist: './lib/esm'
  }
}, {
  inline: true,
  styles: false
});
