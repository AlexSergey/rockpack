import { readPackageJson } from '@rockpack/utils';

// Only a runtime dependency enables polyfills: a devDependency never reaches the bundle.
export const readCoreJsVersion = (root: string): false | string => {
  const coreJsDep = readPackageJson(root)?.dependencies?.['core-js'];

  return typeof coreJsDep === 'string' ? coreJsDep : false;
};
