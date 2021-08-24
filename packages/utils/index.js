const { getMajorVersion } = require('./utils/getMajorVersion');
const { setMode } = require('./utils/setMode');
const { getMode } = require('./utils/getMode');
const { checkReact } = require('./utils/checkReact');
const { getRootRequireDir } = require('./utils/requireDir');

module.exports = {
  getRootRequireDir,
  setMode,
  getMode,
  checkReact,
  getMajorVersion
};
