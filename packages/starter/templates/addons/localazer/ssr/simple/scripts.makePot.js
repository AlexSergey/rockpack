const { localazer } = require('@rockpack/compiler');

localazer.makePot({
  src: './src/client.jsx',
  dist: './locales',
});
