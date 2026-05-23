import latestVersion from 'latest-version';
import { parse } from 'semver';
import { writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sortPackageJson from 'sort-package-json';

const paths = [
  './e2e/babel-e2e/package.json',
  './e2e/starter-e2e/package.json',
  './packages/babel/package.json',
  './packages/codestyle/package.json',
  './packages/compiler/package.json',
  './packages/starter/package.json',
  './packages/tester/package.json',
  './packages/utils/package.json',
];
const fields = ['dependencies', 'devDependencies'];

const pkgs = paths.map((p) => {
  const data = readFileSync(p, 'utf8');
  return {
    data: JSON.parse(data),
    path: p,
  };
});

for (let i = 0; i < pkgs.length; i++) {
  const pkg = pkgs[i].data;
  const p = pkgs[i].path;
  for (let y = 0; y < fields.length; y++) {
    const field = fields[y];
    const deps = pkg[field] || {};
    const names = Object.keys(deps);
    const forUpdate = {};
    for (let j = 0; j < names.length; j++) {
      const dep = names[j];
      if (dep.indexOf('@rockpack/') !== -1) {
        continue;
      }
      const newVersion = await latestVersion(dep);
      const oldVersion = deps[dep];
      if (newVersion !== oldVersion) {
        console.log(
          `[${pkg.name}] dependency ${dep} from "${field}" will be updated from ${oldVersion} to ${newVersion}`,
        );
        const newVersionParsed = parse(newVersion);
        const oldVersionParsed = parse(oldVersion);
        if (newVersionParsed?.major !== oldVersionParsed?.major) {
          console.warn(`Major dependency for ${dep} will be updated`);
        }
        forUpdate[dep] = newVersion;
      }
    }
    if (Object.keys(forUpdate).length > 0) {
      const pathToPackageJson = dirname(p);
      console.warn(`[${pkg.name}] package.json will be updated`);
      const sorted = sortPackageJson({
        ...pkg,
        ...{
          [field]: { ...deps, ...forUpdate },
        },
      });

      if (p.indexOf('starter-e2e') > 0) {
        if (sorted.devDependencies) {
          /*
           * eslint-plugin-package-json has different logic of sorting collections:
           * sortPackageJson by default sort the keys like this:
           *  - @types/koa__router
           *  - @types/koa-static
           * eslint-plugin-package-json expects to have order:
           *  - @types/koa-static
           *  - @types/koa__router
           * */
          const orderedKeys = Object.keys(sorted.devDependencies);
          const indexA = orderedKeys.indexOf('@types/koa__router');
          const indexB = orderedKeys.indexOf('@types/koa-static');

          if (indexA >= 0 && indexB >= 0) {
            [orderedKeys[indexA], orderedKeys[indexB]] = [orderedKeys[indexB], orderedKeys[indexA]];
            sorted.devDependencies = Object.fromEntries(orderedKeys.map((key) => [key, sorted.devDependencies[key]]));
          }
        }
      }

      const updatedPackageJson = JSON.stringify(sorted, null, 2) + '\n';
      writeFileSync(join(pathToPackageJson, 'package.json'), updatedPackageJson);
    }
  }
}
