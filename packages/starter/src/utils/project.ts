import extend from 'deep-extend';
import latestVersion from 'latest-version';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import sortPackageJson from 'sort-package-json';

import type { DependencyGroups, PackageJsonObject } from '../types/package.js';

import { getPM } from './other.js';

export type { DependencyGroups, PackageJsonObject };

export const readPackageJSON = (currentPath: string): Promise<PackageJsonObject> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(currentPath, 'package.json'), (err, data) => {
      if (err) {
        reject(err);

        return;
      }
      let parsed: PackageJsonObject;
      try {
        parsed = JSON.parse(data.toString()) as PackageJsonObject;
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(e);

        return;
      }
      resolve(parsed);
    });
  });
};

export type VersionResolution = {
  // Write the versions from versions.json as they are, without asking the registry.
  readonly offline?: boolean;
  // Pin @rockpack/* to the starter's own version.
  readonly testMode?: boolean;
};

type Dependency = NonNullable<DependencyGroups['dependencies']>[number];

const resolveVersion = (dep: Dependency, { offline = false, testMode = false }: VersionResolution): Promise<string> =>
  offline || (testMode && dep.name.startsWith('@rockpack/'))
    ? Promise.resolve(dep.version)
    : latestVersion(dep.name, { version: dep.version });

export const addDependencies = async (
  packageJSON: PackageJsonObject,
  groups: DependencyGroups,
  resolution: VersionResolution = {},
): Promise<PackageJsonObject> => {
  const toMerge: Record<string, Record<string, string>> = {};

  for (const type of ['dependencies', 'devDependencies', 'peerDependencies'] as const) {
    const resolved: Record<string, string> = {};
    for (const dep of groups[type] ?? []) {
      resolved[dep.name] = await resolveVersion(dep, resolution);
    }
    if (Object.keys(resolved).length > 0) {
      toMerge[type] = resolved;
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
  if (sorted['devDependencies']) {
    const orderedKeys = Object.keys(sorted['devDependencies']);
    const indexA = orderedKeys.indexOf('@types/koa__router');
    const indexB = orderedKeys.indexOf('@types/koa-static');

    const keyA = orderedKeys[indexA];
    const keyB = orderedKeys[indexB];

    if (keyA !== undefined && keyB !== undefined) {
      orderedKeys[indexA] = keyB;
      orderedKeys[indexB] = keyA;
      sorted['devDependencies'] = Object.fromEntries(
        orderedKeys.map((key) => [key, (sorted['devDependencies'] as Record<string, unknown>)[key]]),
      );
    }
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(currentPath, 'package.json'), JSON.stringify(sorted, null, 2) + '\n', (err) => {
      if (err) {
        reject(err);

        return;
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
        reject(err);

        return;
      }
      resolve();
    });
  });
};

export const installDependency = (cwd: string, dependency: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    childProcess.exec(`${getPM()} install ${dependency} -q`, { cwd }, (err) => {
      if (err) {
        reject(err);

        return;
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
