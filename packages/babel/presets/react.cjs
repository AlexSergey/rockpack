'use strict';

/*
 * `@babel/preset-react` for every file except `.ts`, `.mts` and `.cts`. Babel 8 parses JSX in every file
 * preset-react runs on (Babel 7 turned it off for TypeScript files itself), which breaks generic arrow
 * functions such as `<T>(value: T) => value`. The override lives in this preset rather than in the options
 * so it survives configs passed around as JSON (babel-jest, cache keys).
 *
 * Options: the options of `@babel/preset-react`.
 */
const isTypeScriptWithoutJsx = (filename) => typeof filename === 'string' && /\.[cm]?ts$/.test(filename);

module.exports = function rockpackPresetReact(api, options) {
  api.assertVersion('^8.0.0');

  return {
    overrides: [{ exclude: isTypeScriptWithoutJsx, presets: [[require.resolve('@babel/preset-react'), options]] }],
  };
};
