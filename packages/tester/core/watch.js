const jest = require('jest');

const argsCompiler = require('./args-compiler');

function watch(opts = {}) {
  const argv = argsCompiler(opts, 'watch');

  jest.run(argv);
}

module.exports = watch;
