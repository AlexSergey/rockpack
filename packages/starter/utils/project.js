const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const latestVersion = require('latest-version');
const merge = require('merge-package-json');
const sortPackageJson = require('sort-package-json');

const STATE = {
  no_package: 'no_package.json',
  src_not_found: 'src_not_found',
  src_no_empty: 'src_no_empty',
  set_up: 'set_up',
}

const isExist = (currentPath, target) => {
  return new Promise((resolve) => {
    fs.exists(path.resolve(currentPath, target), exists => {
      resolve(exists);
    });
  })
}

const readPackageJSON = (currentPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(currentPath, 'package.json'), (err, data) => {
      if (err) {
        return reject(err);
      }
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch (e) {
        reject(e);
      }
      resolve(parsed);
    });
  })
}

const isSrcFolderEmpty = (currentPath) => {
  return new Promise(async (resolve, reject) => {
    fs.readdir(path.resolve(currentPath, 'src'), (err, files) => {
      if (err) {
        return reject(err);
      } else {
        resolve(!files.length);
      }
    });
  });
}

const checkProjectFolder = async (currentPath) => {
  const packageJSON = await isExist(currentPath, 'package.json');

  if (!packageJSON) {
    return STATE.no_package;
  }

  const isSrcNotFound = await isExist(currentPath, 'src');

  if (!isSrcNotFound) {
    return STATE.src_not_found;
  }

  const isEmpty = await isSrcFolderEmpty(currentPath);

  if (!isEmpty) {
    return STATE.src_no_empty;
  }

  return STATE.set_up;
}

const projectIsReadyForSetup = async (currentPath, {
  onPackageJSONNotFound,
  onSrcFolderNotFound,
  onSrcFolderNotEmpty
}) => {
  const state = await checkProjectFolder(currentPath);

  switch (state) {
    case STATE.no_package:
      return await onPackageJSONNotFound();
    case STATE.src_not_found:
      return await onSrcFolderNotFound();
    case STATE.src_no_empty:
      return await onSrcFolderNotEmpty();
  }
}

const addLibraries = async (packageJSON, { dependencies = [], devDependencies = [] }) => {
  const toMerge = {
    dependencies: {},
    devDependencies: {}
  };

  for (let i = 0, l = dependencies.length; i < l; i++) {
    const dep = dependencies[i];
    const depVersion = await latestVersion(dep.name, { version: dep.version });
    toMerge.dependencies[dep.name] = depVersion;
  }

  for (let i = 0, l = devDependencies.length; i < l; i++) {
    const devDep = devDependencies[i];
    const devDepVersion = await latestVersion(devDep.name, { version: devDep.version });
    toMerge.devDependencies[devDep.name] = devDepVersion;
  }

  return JSON.parse(merge(packageJSON, toMerge));
}

const addScripts = (packageJSON, scripts = {}) => {
  return JSON.parse(merge(packageJSON, { scripts }));
}

const writePackageJSON = (currentPath, packageJSON) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(currentPath, 'package.json'), JSON.stringify(sortPackageJson(packageJSON), null, 2), err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

const createProject = () => {
  return new Promise((resolve, reject) => {
    childProcess.exec('npm init -y --silent', (err) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve();
    });
  });
}

const npmInstall = () => {
  return new Promise((resolve, reject) => {
    childProcess.exec('npm install --silent', (err) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve();
    });
  });
}

module.exports.npmInstall = npmInstall;
module.exports.createProject = createProject;
module.exports.addScripts = addScripts;
module.exports.addLibraries = addLibraries;
module.exports.readPackageJSON = readPackageJSON;
module.exports.writePackageJSON = writePackageJSON;
module.exports.projectIsReadyForSetup = projectIsReadyForSetup;
