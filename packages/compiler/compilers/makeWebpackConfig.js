const _compile = require('../core/_compile');

async function makeWebpackConfig(options, cb) {
    let { webpackConfig } = await _compile(options, cb, true);
    return webpackConfig;
}

module.exports = makeWebpackConfig;
