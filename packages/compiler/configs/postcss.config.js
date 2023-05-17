const autoprefixer = require('autoprefixer');
const postcssCustomMedia = require('postcss-custom-media');
const minmax = require('postcss-media-minmax');

module.exports = {
  plugins: [minmax(), postcssCustomMedia(), autoprefixer({ overrideBrowserslist: ['> 5%'] })],
};
