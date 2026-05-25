import extend from 'deep-extend';
import latestVersion from 'latest-version';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import sortPackageJson from 'sort-package-json';

import type { DependencyGroups, PackageJsonObject } from '../types/package';

import { getPM } from './other';

export type { DependencyGroups, PackageJsonObject };

export const readPackageJSON = (currentPath: string): Promise<PackageJsonObject> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(currentPath, 'package.json'), (err, data) => {
      if (err) {
        return reject(err);
      }
      let parsed: PackageJsonObject;
      try {
        parsed = JSON.parse(data.toString()) as PackageJsonObject;
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        return reject(e);
      }
      resolve(parsed);
    });
  });
};

export const addDependencies = async (
  packageJSON: PackageJsonObject,
  { dependencies = [], devDependencies = [], peerDependencies = [] }: DependencyGroups,
  testMode = false,
): Promise<PackageJsonObject> => {
  const toMerge: {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    peerDependencies: Record<string, string>;
  } = {
    dependencies: {},
    devDependencies: {},
    peerDependencies: {},
  };

  for (const dep of dependencies) {
    if (testMode && dep.name.startsWith('@rockpack/')) {
      toMerge.dependencies[dep.name] = dep.version;
    } else {
      toMerge.dependencies[dep.name] = await latestVersion(dep.name, { version: dep.version });
    }
  }

  for (const devDep of devDependencies) {
    if (testMode && devDep.name.startsWith('@rockpack/')) {
      toMerge.devDependencies[devDep.name] = devDep.version;
    } else {
      toMerge.devDependencies[devDep.name] = await latestVersion(devDep.name, { version: devDep.version });
    }
  }

  for (const peerDep of peerDependencies) {
    if (testMode && peerDep.name.startsWith('@rockpack/')) {
      toMerge.peerDependencies[peerDep.name] = peerDep.version;
    } else {
      toMerge.peerDependencies[peerDep.name] = await latestVersion(peerDep.name, { version: peerDep.version });
    }
  }

  for (const type of Object.keys(toMerge) as (keyof typeof toMerge)[]) {
    if (Object.keys(toMerge[type]).length === 0) {
      delete toMerge[type];
    }
  }

  return extend({}, packageJSON, toMerge);
};

export const addFields = (packageJSON: PackageJsonObject, fields: PackageJsonObject = {}): PackageJsonObject => {
  return extend({}, packageJSON, fields);
};

export const addScripts = (packageJSON: PackageJsonObject, scripts: Record<string, string> = {}): PackageJsonObject => {
  return extend({}, packageJSON, { scripts });
};

export const writePackageJSON = (currentPath: string, packageJSON: PackageJsonObject): Promise<void> => {
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
      [orderedKeys[indexA], orderedKeys[indexB]] = [orderedKeys[indexB]!, orderedKeys[indexA]!];
      sorted.devDependencies = Object.fromEntries(
        orderedKeys.map((key) => [key, (sorted.devDependencies as Record<string, unknown>)[key]]),
      );
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

export const createPackageJSON = (projectName: string): PackageJsonObject => ({
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

export const installDependencies = (cwd: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    childProcess.exec(`${getPM()} install -q`, { cwd }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export const installDependency = (cwd: string, dependency: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    childProcess.exec(`${getPM()} install ${dependency} -q`, { cwd }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export const installPeerDependencies = async (packageJSON: PackageJsonObject, currentPath: string): Promise<void> => {
  const peerDependencies = packageJSON['peerDependencies'] as Record<string, string> | undefined;
  if (!peerDependencies) return;
  for (const depName of Object.keys(peerDependencies)) {
    const depVersion = peerDependencies[depName];
    await installDependency(currentPath, `${depName}@${depVersion}`);
  }
};
