const tailwindcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');
const postcssCustomMedia = require('postcss-custom-media');
const minmax = require('postcss-media-minmax');

module.exports = {
  plugins: [tailwindcss(), minmax(), postcssCustomMedia(), autoprefixer({ overrideBrowserslist: ['> 5%'] })],
};
