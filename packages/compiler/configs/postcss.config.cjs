const tailwindcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');
const postcssCustomMedia = require('postcss-custom-media');
const minmax = require('postcss-media-minmax');

const postcssCustomMediaFn =
  typeof postcssCustomMedia.default === 'function' ? postcssCustomMedia.default : postcssCustomMedia;

module.exports = {
  plugins: [tailwindcss(), minmax(), postcssCustomMediaFn(), autoprefixer({ overrideBrowserslist: ['> 5%'] })],
};
