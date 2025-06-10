const { makeConfig } = require('./index.js');

const config = makeConfig();

config.push({
  rules: {
    'package-json/require-type': 'off',
  },
});

module.exports = config;
