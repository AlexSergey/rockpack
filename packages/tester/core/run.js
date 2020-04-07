const jest = require('jest');
const argsCompiler = require('./argsCompiler');

function run(opts = {}) {
  const argv = argsCompiler(opts, 'run');
  
  jest.run(argv);
}

module.exports = run;
