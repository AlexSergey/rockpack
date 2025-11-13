const { getMajorVersion } = require('./utils/get-major-version');
const { getMode } = require('./utils/get-mode');
const { getRootRequireDir } = require('./utils/require-dir');
const { setMode } = require('./utils/set-mode');

module.exports = {
  getMajorVersion,
  getMode,
  getRootRequireDir,
  setMode,
};
