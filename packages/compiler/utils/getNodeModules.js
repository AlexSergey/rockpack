const finder = require('find-package-json');
const path = require('path');
const fs = require('fs');

const getNodeModules = (root) => {
  const f = finder(root);
  const packages = [];
  let packageJSON = f.next();

  while (!packageJSON.done) {
    const currentPath = path.dirname(packageJSON.filename);
    const nodeModulesPath = path.resolve(currentPath, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      packages.push(nodeModulesPath);
    }
    packageJSON = f.next();
  }

  return packages;
};

module.exports = getNodeModules;
