const { libraryCompiler } = require('@rockpack/compiler');

libraryCompiler({
  name: 'RockLog',
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
