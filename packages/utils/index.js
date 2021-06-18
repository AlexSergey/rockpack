const { getMajorVersion } = require('./utils/getMajorVersion');
const { setMode } = require('./utils/setMode');
const { getRootRequireDir } = require('./utils/requireDir');

module.exports = {
  getRootRequireDir,
  setMode,
  getMajorVersion
};
