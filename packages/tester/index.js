const { setMode } = require('@rockpack/utils');

const init = require('./core/init');

module.exports = function test(opts) {
  setMode(['development', 'production', 'test'], 'test');

  init(opts).catch(console.error);
};
