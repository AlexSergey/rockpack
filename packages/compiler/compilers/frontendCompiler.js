const _compile = require('../core/_compile');

async function frontendCompiler(options, cb, configOnly = false) {
    return await _compile(options, cb, configOnly);
}

module.exports = frontendCompiler;
