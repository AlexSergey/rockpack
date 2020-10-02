const { localazer } = require('@rockpack/compiler');

localazer.makePot({
  src: './src/index.tsx',
  dist: './locales',
});
