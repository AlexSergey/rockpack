const { libraryCompiler } = require('@rockpack/compiler');

libraryCompiler({
  name: 'RockLogger',
  cjs: {
    src: './src',
    dist: './lib/cjs'
  },
  esm: {
    src: './src',
    dist: './lib/esm'
  }
}, null, config => {
  config.externals = [
    'react',
    'react-dom'
  ];
});
