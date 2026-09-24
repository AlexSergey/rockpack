import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { join } from 'node:path';
import { writeFileSync, readFileSync } from 'node:fs';
import { EOL } from 'node:os';
import { valid } from 'semver';

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

if (!valid(version)) {
  throw new Error(`"${version}" is not a valid semver version`);
}

const pinRockpack = (deps: Record<string, string> | undefined): void => {
  for (const dep of Object.keys(deps ?? {})) {
    if (dep.startsWith('@rockpack/') && deps) {
      deps[dep] = version;
    }
  }
};

const projects = [...getWorkspacePackageJsons(), 'package.json'];

// Read and update every file first, so a missing or malformed file leaves the tree untouched.
const updates = projects.map((projectPath) => {
  const pthPackageJson = join(process.cwd(), projectPath);
  const file = JSON.parse(readFileSync(pthPackageJson, 'utf8')) as PackageJson;

  file.version = version;
  pinRockpack(file.dependencies);
  pinRockpack(file.devDependencies);

  return { content: JSON.stringify(file, null, 2) + EOL, path: pthPackageJson };
});

// lerna runs in fixed mode: its version follows the workspaces.
const lernaPath = join(process.cwd(), 'lerna.json');
const lerna = JSON.parse(readFileSync(lernaPath, 'utf8')) as Record<string, unknown>;
updates.push({ content: JSON.stringify({ ...lerna, version }, null, 2) + EOL, path: lernaPath });

for (const { content, path } of updates) {
  writeFileSync(path, content, 'utf-8');
}

console.log(`Version ${version} is set in lerna.json and ${updates.length - 1} package.json files`);
