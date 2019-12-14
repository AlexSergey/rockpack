const _compile = require('../core/_compile');
const errorHandler = require('../errorHandler');

async function analyzerCompiler(options = {}, cb, configOnly = false) {
    errorHandler();
    return await _compile(options, cb, configOnly);
}

module.exports = analyzerCompiler;
