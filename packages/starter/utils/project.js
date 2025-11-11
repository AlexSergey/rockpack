import extend from 'deep-extend';
import latestVersion from 'latest-version';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
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
  });
};

export const addDependencies = async (
  packageJSON,
  { dependencies = [], devDependencies = [], peerDependencies = [] },
) => {
  const toMerge = {
    dependencies: {},
    devDependencies: {},
    peerDependencies: {},
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

  Object.keys(toMerge).forEach((type) => {
    if (Object.keys(toMerge[type]).length === 0) {
      delete toMerge[type];
    }
  });

  return extend({}, packageJSON, toMerge);
};

export const addFields = (packageJSON, fields = {}) => {
  return extend({}, packageJSON, fields);
};

export const addScripts = (packageJSON, scripts = {}) => {
  return extend({}, packageJSON, { scripts });
};

export const writePackageJSON = (currentPath, packageJSON) => {
  const sorted = sortPackageJson(packageJSON);

  /*
   * eslint-plugin-package-json has different logic of sorting collections:
   * sortPackageJson by default sort the keys like this:
   *  - @types/koa__router
   *  - @types/koa-static
   * eslint-plugin-package-json expects to have order:
   *  - @types/koa-static
   *  - @types/koa__router
   * This fix important only in generation stage, after generation package json will be sorted by eslint-plugin-package-json
   * */
  if (sorted.devDependencies) {
    const orderedKeys = Object.keys(sorted.devDependencies);
    const indexA = orderedKeys.indexOf('@types/koa__router');
    const indexB = orderedKeys.indexOf('@types/koa-static');

    if (indexA >= 0 && indexB >= 0) {
      [orderedKeys[indexA], orderedKeys[indexB]] = [orderedKeys[indexB], orderedKeys[indexA]];
      sorted.devDependencies = Object.fromEntries(orderedKeys.map((key) => [key, sorted.devDependencies[key]]));
    }
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(currentPath, 'package.json'), JSON.stringify(sorted, null, 2) + '\n', (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export const createPackageJSON = (projectName) => ({
  author: 'email@email.com',
  description: '<description>',
  keywords: [projectName],
  license: 'ISC',
  main: 'index.js',
  name: projectName,
  scripts: {
    test: 'echo "Error: no test specified" && exit 1',
  },
  version: '1.0.0',
});

export const installDependencies = (cwd) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(
      `${getPM()} install -q`,
      {
        cwd,
      },
      (err, a, b) => {
        if (err) {
          return reject(err);
        }
        resolve();
      },
    );
  });
};

export const installDependency = (cwd, dependency) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(
      `${getPM()} install ${dependency} -q`,
      {
        cwd,
      },
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      },
    );
  });
};

export const installPeerDependencies = async (packageJSON, currentPath) => {
  const { peerDependencies } = packageJSON;
  for (const depName in peerDependencies) {
    if (peerDependencies.hasOwnProperty(depName)) {
      let depVersion = peerDependencies[depName];
      await installDependency(currentPath, `${depName}@${depVersion}`);
    }
  }
};
