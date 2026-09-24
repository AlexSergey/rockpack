import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { join } from 'node:path';
import { writeFileSync, readFileSync } from 'node:fs';
import { EOL } from 'node:os';

import { getWorkspacePackageJsons } from './tools/workspaces';

type PackageJson = {
  name?: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
};

const argv = yargs(hideBin(process.argv)).parseSync();

if (argv._.length !== 1) {
  throw new Error('Provide version x.x.x to the argument');
}

const version = String(argv._[0]);
const part = version.split('-')[0];
const format = part.split('.');

if (format.filter((f) => f !== '').length !== 3) {
  throw new Error('The version should be matched to the x.x.x format');
}

const projects = [...getWorkspacePackageJsons(), 'package.json'];

for (const projectPath of projects) {
  const pthPackageJson = join(process.cwd(), projectPath);
  const file = JSON.parse(readFileSync(pthPackageJson, 'utf8')) as PackageJson;
  const { dependencies, devDependencies } = file;
  const depKeys = dependencies ? Object.keys(dependencies) : [];
  const devDepKeys = devDependencies ? Object.keys(devDependencies) : [];
  const depKeysExisted = depKeys.filter((dep) => dep.indexOf('@rockpack/') === 0);
  const devDepKeysExisted = devDepKeys.filter((dep) => dep.indexOf('@rockpack/') === 0);

  file.version = version;

  depKeysExisted.forEach((k) => {
    (file.dependencies as Record<string, string>)[k] = version;
  });

  devDepKeysExisted.forEach((k) => {
    (file.devDependencies as Record<string, string>)[k] = version;
  });

  writeFileSync(pthPackageJson, JSON.stringify(file, null, 2) + EOL, 'utf-8');
}
