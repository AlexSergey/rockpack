const { libraryCompiler } = require('@rock/compiler');

libraryCompiler({
  name: 'USSRServer',
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
