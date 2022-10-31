const fs = require('fs');
const path = require('path');
const { pascalCase } = require('pascal-case');
const { dummies } = require('../utils/pathes');
const { showError } = require('../utils/error');

const createFiles = async (currentPath, {
  projectName,
  appType,
  tester,
  codestyle
}) => {
  if (fs.existsSync(path.join(currentPath, '.env.example'))) {
    fs.copyFileSync(path.join(currentPath, '.env.example'), path.join(currentPath, '.env'));
  }

  if (appType === 'library') {
    try {
      let build = fs.readFileSync(path.join(dummies, 'build.library'), 'utf8')
        .toString();
      let prefix = '';
      if (projectName.length === 1) {
        const isNumber = !isNaN(parseFloat(projectName));
        prefix += isNumber ? 'Library' : '';
      }
      build = build.replace(/%libraryName%/g, pascalCase(`${prefix}${projectName}`));
      fs.writeFileSync(path.join(currentPath, 'scripts.build.js'), build);
    } catch (e) {
      showError(e, () => {
        console.error('Step: 7.1. Creating library scripts.build.js');
      });
    }
  }

  if (appType === 'component') {
    try {
      let build = fs.readFileSync(path.join(dummies, 'build.component'), 'utf8')
        .toString();
      let prefix = '';
      if (projectName.length === 1) {
        const isNumber = !isNaN(parseFloat(projectName));
        prefix += isNumber ? 'Component' : '';
      }
      build = build.replace(/%componentName%/g, pascalCase(`${prefix}${projectName}`));
      fs.writeFileSync(path.join(currentPath, 'scripts.build.js'), build);
    } catch (e) {
      showError(e, () => {
        console.error('Step: 7.1. Creating component scripts.build.js');
      });
    }
  }
};

module.exports = createFiles;
