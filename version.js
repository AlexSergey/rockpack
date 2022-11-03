const { argv } = require('yargs');
const { join } = require('path');
const editJsonFile = require('edit-json-file');

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
  let file = editJsonFile(join(__dirname, projectPath));
  const { dependencies, devDependencies } = file.get();
  const depKeys = dependencies ? Object.keys(dependencies) : [];
  const devDepKeys = devDependencies ? Object.keys(devDependencies) : [];
  const depKeysExist = depKeys.filter(dep => dep.indexOf('@rockpack/') === 0);
  const devDepKeysExist = devDepKeys.filter(dep => dep.indexOf('@rockpack/') === 0);

  file.set('version', version);

  depKeysExist.forEach(k => {
    file.set(`dependencies.${k}`, version);
  });
  devDepKeysExist.forEach(k => {
    file.set(`devDependencies.${k}`, version);
  });
  file.save();
}
