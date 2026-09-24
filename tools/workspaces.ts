import { existsSync, globSync, readFileSync } from 'node:fs';
import path from 'node:path';

type RootPackageJson = {
  workspaces?: string[];
};

/**
 * Relative paths (from the repository root) of every workspace package.json,
 * resolved from the root `workspaces` globs. The root package.json is not included.
 */
export function getWorkspacePackageJsons(root: string = process.cwd()): string[] {
  const { workspaces = [] } = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')) as RootPackageJson;

  return workspaces
    .flatMap((pattern) => globSync(pattern, { cwd: root }))
    .map((dir) => path.join(dir, 'package.json'))
    .filter((file) => existsSync(path.join(root, file)))
    .sort();
}
