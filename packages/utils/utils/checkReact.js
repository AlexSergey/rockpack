const { isString, isObject } = require('valid-types');
const { getMajorVersion } = require('./getMajorVersion');

const checkReact = (packageJson) => {
  let hasReact = false;
  let reactNewSyntax = false;
  if (
    packageJson &&
    isObject(packageJson.dependencies) &&
    isString(packageJson.dependencies.react)
  ) {
    hasReact = true;
    reactNewSyntax = getMajorVersion(packageJson.dependencies.react) >= 17;
  } else if (
    packageJson &&
    isObject(packageJson.peerDependencies) &&
    isString(packageJson.peerDependencies.react)
  ) {
    hasReact = true;
    reactNewSyntax = getMajorVersion(packageJson.peerDependencies.react) >= 17;
  }
  return {
    hasReact,
    reactNewSyntax
  };
};

module.exports = {
  checkReact
};
