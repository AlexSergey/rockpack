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
  debug: true,
  inline: true,
  styles: false
});
