const { localazer } = require('@rockpack/compiler');

localazer.makePo({
  src: './src/client.tsx',
  dist: './locales'
});
