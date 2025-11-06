import latestVersion from 'latest-version';
import { parse } from 'semver';
import { writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sortPackageJson from 'sort-package-json';

const paths = [
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
      const updatedPackageJson =
        JSON.stringify(
          sortPackageJson({
            ...pkg,
            ...{
              [field]: { ...deps, ...forUpdate },
            },
          }),
          null,
          2,
        ) + '\n';
      writeFileSync(join(pathToPackageJson, 'package.json'), updatedPackageJson);
    }
  }
}
