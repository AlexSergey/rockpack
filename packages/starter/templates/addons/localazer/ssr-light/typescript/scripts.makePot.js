const { localazer } = require('@rockpack/compiler');

localazer.makePot({
  src: './src/client.tsx',
  dist: './locales',
});
