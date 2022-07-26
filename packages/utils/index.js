const { checkReact } = require('./utils/check-react');
const { getMajorVersion } = require('./utils/get-major-version');
const { getMode } = require('./utils/get-mode');
const { getRootRequireDir } = require('./utils/require-dir');
const { setMode } = require('./utils/set-mode');

module.exports = {
  checkReact,
  getMajorVersion,
  getMode,
  getRootRequireDir,
  setMode,
};
