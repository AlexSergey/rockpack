const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [autoprefixer({ overrideBrowserslist: ['> 5%'] })],
};
