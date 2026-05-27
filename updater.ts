import latestVersion from 'latest-version';
import { parse } from 'semver';
import { writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sortPackageJson from 'sort-package-json';

type PackageJson = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
};

type VersionEntry = {
  name: string;
  version: string;
};

type VersionsJson = Record<string, Record<string, Record<string, VersionEntry[]>>>;

async function updateAllDeps(): Promise<void> {
  const paths = [
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
    './packages/utils/package.json',
  ];

  const fields: ReadonlyArray<'dependencies' | 'devDependencies'> = ['dependencies', 'devDependencies'];

  const pkgs = paths.map((p) => ({
    data: JSON.parse(readFileSync(p, 'utf8')) as PackageJson,
    path: p,
  }));

  for (let i = 0; i < pkgs.length; i++) {
    const pkg = pkgs[i].data;
    const p = pkgs[i].path;
    for (let y = 0; y < fields.length; y++) {
      const field = fields[y];
      const deps = pkg[field] ?? {};
      const names = Object.keys(deps);
      const forUpdate: Record<string, string> = {};
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
          [field]: { ...deps, ...forUpdate },
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
              sorted.devDependencies = Object.fromEntries(
                orderedKeys.map((key) => [key, (sorted.devDependencies as Record<string, string>)[key]]),
              );
            }
          }
        }

        const updatedPackageJson = JSON.stringify(sorted, null, 2) + '\n';
        writeFileSync(join(pathToPackageJson, 'package.json'), updatedPackageJson);
      }
    }
  }
}

async function updateStarterDeps(): Promise<void> {
  const pth = './packages/starter/src/versions.json';

  const data = JSON.parse(readFileSync(pth, 'utf8')) as VersionsJson;
  let wasUpdated = false;

  console.log('---');
  console.log('Dependencies checking in @rockpack/starter');
  console.log('---');

  for (const type in data) {
    for (const variations in data[type]) {
      for (const depType in data[type][variations]) {
        const dependencies = data[type][variations][depType];

        for (const dependency of dependencies) {
          const { name, version } = dependency;
          const newVersion = await latestVersion(name);
          const parsed = parse(newVersion);
          const major = parsed?.major ?? 0;

          if (major > Number(version)) {
            console.log(`[${name}] will be updated from ${version} to ${major}`);
            const index = dependencies.findIndex(({ name: n }) => n === dependency.name);
            dependencies[index] = { name, version: `${major}` };
            wasUpdated = true;
          }
        }
      }
    }
  }
  if (wasUpdated) {
    const updatedPackageJson = JSON.stringify(data, null, 2) + '\n';
    writeFileSync(pth, updatedPackageJson);
  }
}

async function bootstrap(): Promise<void> {
  await updateAllDeps();
  await updateStarterDeps();
}

void bootstrap();
