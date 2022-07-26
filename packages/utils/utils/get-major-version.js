const semver = require('semver');

const getMajorVersion = (version) => semver.minVersion(version).major;

module.exports = {
  getMajorVersion,
};
