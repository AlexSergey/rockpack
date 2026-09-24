'use strict';

/*
 * babel-plugin-transform-import-meta rewrites `import.meta.url` to
 * `require('url').pathToFileURL(__filename)`. A module that declares its own
 * `const __filename = fileURLToPath(import.meta.url)` would then read that binding
 * before it is initialised. Renaming module-level `__filename`/`__dirname`
 * bindings first keeps the rewritten code pointing at the CommonJS globals.
 */
module.exports = function renameCjsGlobals() {
  return {
    name: 'rockpack-rename-cjs-globals',
    visitor: {
      Program(path) {
        for (const name of ['__filename', '__dirname']) {
          if (path.scope.hasOwnBinding(name)) {
            path.scope.rename(name, path.scope.generateUidIdentifier(name.slice(2)).name);
          }
        }
      },
    },
  };
};
