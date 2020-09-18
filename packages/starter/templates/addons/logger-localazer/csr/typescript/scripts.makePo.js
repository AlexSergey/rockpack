const { localazer } = require('@rockpack/compiler');

localazer.makePo({
  src: './src/index.tsx',
  dist: './locales'
});
