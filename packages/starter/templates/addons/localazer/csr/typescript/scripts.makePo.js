const { localazer } = require('@rockpack/compiler');

localazer.makePo({
  src: './src/index.jsx',
  dist: './locales'
});
