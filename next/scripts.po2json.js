const { localazer } = require('@rock/compiler');

localazer.po2json({
  src: './locales',
  dist: './src/locales'
});
