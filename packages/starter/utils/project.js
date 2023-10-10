import fs from 'node:fs';
import path from 'node:path';
import childProcess from 'node:child_process';
import latestVersion from 'latest-version';
import merge from 'merge-package-json';
import sortPackageJson from 'sort-package-json';
import { getPM } from './other.js';

export const readPackageJSON = (currentPath) => {
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

export const addDependencies = async (packageJSON, { dependencies = [], devDependencies = [], peerDependencies = [] }) => {
  const toMerge = {
    dependencies: {},
    devDependencies: {},
    peerDependencies: {}
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

  for (let i = 0, l = peerDependencies.length; i < l; i++) {
    const peerDep = peerDependencies[i];
    const peerVersion = await latestVersion(peerDep.name, { version: peerDep.version });
    toMerge.peerDependencies[peerDep.name] = peerVersion;
  }

  Object.keys(toMerge).forEach(type => {
    if (Object.keys(toMerge[type]).length === 0) {
      delete toMerge[type];
    }
  });

  return JSON.parse(merge(packageJSON, toMerge));
}

export const addFields = (packageJSON, fields = {}) => {
  return JSON.parse(merge(packageJSON, fields));
}

export const addScripts = (packageJSON, scripts = {}) => {
  return JSON.parse(merge(packageJSON, { scripts }));
}

export const writePackageJSON = (currentPath, packageJSON) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(currentPath, 'package.json'), JSON.stringify(sortPackageJson(packageJSON), null, 2), err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

export const createPackageJSON = (projectName) => (
  {
    name: projectName,
    version: '1.0.0',
    description: '',
    main: 'index.js',
    scripts: {
      'test': 'echo \"Error: no test specified\" && exit 1'
    },
    keywords: [],
    author: '',
    license: 'ISC'
  }
)

export const installDependencies = (cwd) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(`${getPM()} install -q`, {
      cwd
    }, (err, a, b) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

export const installDependency = (cwd, dependency) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(`${getPM()} install ${dependency} -q`, {
      cwd
    }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

export const installPeerDependencies = async (packageJSON, currentPath) => {
  const { peerDependencies } = packageJSON;
  for (const depName in peerDependencies) {
    if (peerDependencies.hasOwnProperty(depName)) {
      let depVersion = peerDependencies[depName];
      await installDependency(currentPath, `${depName}@${depVersion}`);
    }
  }
}
