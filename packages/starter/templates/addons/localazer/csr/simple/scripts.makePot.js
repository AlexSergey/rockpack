const { localazer } = require('@rockpack/compiler');

localazer.makePot({
  src: './src/index.jsx',
  dist: './locales',
});
