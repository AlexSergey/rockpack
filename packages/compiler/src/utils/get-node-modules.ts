import finder from 'find-package-json';
import { existsSync } from 'node:fs';
import path from 'node:path';

export const getNodeModules = (root: string): string[] => {
  const f = finder(root);
  const packages: string[] = [];
  let packageJSON = f.next();

  while (!packageJSON.done) {
    const currentPath = path.dirname(packageJSON.filename ?? '');
    const nodeModulesPath = path.resolve(currentPath, 'node_modules');
    if (existsSync(nodeModulesPath)) {
      packages.push(nodeModulesPath);
    }
    packageJSON = f.next();
  }

  return packages;
};
