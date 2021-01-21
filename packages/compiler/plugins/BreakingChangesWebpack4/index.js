const mkdirp = require('mkdirp');

/**
 * This plugin should fix breaking changes in webpack 5+
 * outputFileSystem.mkdirp is not exist in webpack 5
 * Prerender SPA Plugin compatibility issue
 * https://github.com/chrisvfritz/prerender-spa-plugin/pull/415/files
 * */
class BreakingChangesWebpack4 {
  apply(compiler) {
    if (!compiler.outputFileSystem.mkdirp) {
      compiler.outputFileSystem.mkdirp = async (dir, opts, cb) => {
        try {
          const state = await mkdirp(dir, opts);
          cb(null, state);
        } catch (e) {
          cb(e);
        }
      };
    }
  }
}

module.exports = BreakingChangesWebpack4;
