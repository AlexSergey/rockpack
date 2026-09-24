import { readFileSync } from 'node:fs';
import path from 'node:path';

import { repoRoot } from './paths.js';

type Lockfile = {
  readonly packages: Record<string, { readonly version?: string }>;
};

type PackageJson = Record<string, unknown> & {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies'] as const;

// Versions a project resolves to: the root node_modules, overridden by the nested node_modules of the given workspaces
// (a project generated inside e2e/starter-e2e sees e2e/starter-e2e/node_modules first).
export const readLockedVersions = (
  lockfilePath = path.join(repoRoot, 'package-lock.json'),
  workspaces: readonly string[] = [],
): Map<string, string> => {
  const { packages } = JSON.parse(readFileSync(lockfilePath, 'utf8')) as Lockfile;
  const versions = new Map<string, string>();
  const prefixes = ['', ...workspaces.map((workspace) => `${workspace}/`)];
  for (const prefix of prefixes) {
    for (const [location, { version }] of Object.entries(packages)) {
      if (!location.startsWith(`${prefix}node_modules/`)) {
        continue;
      }
      const name = location.slice(`${prefix}node_modules/`.length);
      if (version && /^(?:@[^/]+\/)?[^/]+$/.test(name)) {
        versions.set(name, version);
      }
    }
  }

  return versions;
};

// Pinned mode: rewrites dependency versions to the lockfile versions so package.json matches what actually runs.
// @rockpack/* keep their version (they resolve to the workspace packages); unknown packages are reported.
export const pinToLockfile = (
  packageJson: PackageJson,
  locked: ReadonlyMap<string, string>,
): { missing: string[]; packageJson: PackageJson } => {
  const missing: string[] = [];
  const pinned: PackageJson = { ...packageJson };
  for (const field of DEPENDENCY_FIELDS) {
    const deps = packageJson[field];
    if (!deps) {
      continue;
    }
    pinned[field] = Object.fromEntries(
      Object.entries(deps).map(([name, version]) => {
        if (name.startsWith('@rockpack/')) {
          return [name, version];
        }
        const lockedVersion = locked.get(name);
        if (!lockedVersion) {
          missing.push(name);

          return [name, version];
        }

        return [name, lockedVersion];
      }),
    );
  }

  return { missing, packageJson: pinned };
};
