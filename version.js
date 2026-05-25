const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const { join } = require('path');
const { writeFileSync } = require('fs');
const { EOL } = require('os');

const argv = yargs(hideBin(process.argv)).parse();

if (argv._.length !== 1) {
  throw new Error('Provide version x.x.x to the argument');
}

const version = argv._[0];
const part = version.split('-')[0];
const format = part.split('.');

if (format.filter((f) => f !== '').length !== 3) {
  throw new Error('The version should be matched to the x.x.x format');
}

const projects = [
  './book/package.json',
  './e2e/babel-e2e/package.json',
  './e2e/starter-e2e/package.json',
  './examples/compiler/advanced-config-elm-support/package.json',
  './examples/compiler/analyzer/package.json',
  './examples/compiler/antd/package.json',
  './examples/compiler/css-modules/package.json',
  './examples/compiler/custom-html/package.json',
  './examples/compiler/dotenv/package.json',
  './examples/compiler/eslint/package.json',
  './examples/compiler/imagemin/package.json',
  './examples/compiler/isomorphic/package.json',
  './examples/compiler/library-react-ts/package.json',
  './examples/compiler/library/package.json',
  './examples/compiler/mdx/package.json',
  './examples/compiler/nodejs/package.json',
  './examples/compiler/postcss/package.json',
  './examples/compiler/react-app/package.json',
  './examples/compiler/source-js/package.json',
  './examples/compiler/source-ts/package.json',
  './examples/compiler/svg/package.json',
  './examples/compiler/ts-css-modules/package.json',
  './examples/compiler/typescript/package.json',
  './examples/compiler/vendor/package.json',
  './examples/tester/debug/package.json',
  './examples/tester/es2015+/package.json',
  './examples/tester/graphql/package.json',
  './examples/tester/node-jest-environment/package.json',
  './examples/tester/node-jest-extend/package.json',
  './examples/tester/react/package.json',
  './examples/tester/rest/package.json',
  './examples/tester/simple/package.json',
  './examples/tester/sinon/package.json',
  './examples/tester/typescript/package.json',
  './packages/babel/package.json',
  './packages/codestyle/package.json',
  './packages/compiler/package.json',
  './packages/starter/package.json',
  './packages/tester/package.json',
  './packages/tsconfig/package.json',
  './packages/utils/package.json',
  './package.json',
];

for (let projectPath of projects) {
  const pthPackageJson = join(__dirname, projectPath);
  const file = require(pthPackageJson);
  const { dependencies, devDependencies } = file;
  const depKeys = dependencies ? Object.keys(dependencies) : [];
  const devDepKeys = devDependencies ? Object.keys(devDependencies) : [];
  const depKeysExisted = depKeys.filter((dep) => dep.indexOf('@rockpack/') === 0);
  const devDepKeysExisted = devDepKeys.filter((dep) => dep.indexOf('@rockpack/') === 0);

  file.version = version;

  depKeysExisted.forEach((k) => {
    file.dependencies[k] = version;
  });

  devDepKeysExisted.forEach((k) => {
    file.devDependencies[k] = version;
  });

  writeFileSync(pthPackageJson, JSON.stringify(file, null, 2) + EOL, 'utf-8');
}
