const { localazer } = require('@rock/compiler');

localazer.makePo({
  src: './src/client.tsx',
  dist: './locales'
});
