const { localazer } = require('@rockpack/compiler');

localazer.po2json({
  src: './locales',
  dist: './src/localization/locales'
});
