const { argv } = require('yargs');
const { join } = require('path');
const { writeFileSync } = require('fs');
const { EOL } = require('os');

if (argv._.length !== 1) {
  throw new Error('Provide version x.x.x to the argument');
}

const version = argv._[0];
const part = version.split('-')[0];
const format = part.split('.');

if (format.filter(f => f !== '').length !== 3) {
  throw new Error('The version should be matched to the x.x.x format');
}

const projects = [
  './book/package.json',
  './next/api/package.json',
  './next/web-client/package.json',
  './packages/babel/package.json',
  './packages/codestyle/package.json',
  './packages/compiler/package.json',
  './packages/starter/package.json',
  './packages/tester/package.json',
  './packages/tsconfig/package.json',
  './packages/utils/package.json',
  './package.json'
];

for (let projectPath of projects) {
  const pthPackageJson = join(__dirname, projectPath);
  const file = require(pthPackageJson);
  const { dependencies, devDependencies } = file;
  const depKeys = dependencies ? Object.keys(dependencies) : [];
  const devDepKeys = devDependencies ? Object.keys(devDependencies) : [];
  const depKeysExisted = depKeys.filter(dep => dep.indexOf('@rockpack/') === 0);
  const devDepKeysExisted = devDepKeys.filter(dep => dep.indexOf('@rockpack/') === 0);

  file.version = version;

  depKeysExisted.forEach(k => {
    file.dependencies[k] = version;
  });

  devDepKeysExisted.forEach(k => {
    file.devDependencies[k] = version;
  });

  writeFileSync(pthPackageJson, JSON.stringify(file, null, 2) + EOL, 'utf-8');
}
