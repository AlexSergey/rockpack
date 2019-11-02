const jest = require('jest');
const argsCompiler = require('./argsCompiler');

function watch(opts = {}) {
    let argv = argsCompiler(opts, 'watch');

    jest.run(argv);
}

module.exports = watch;
