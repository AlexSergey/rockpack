import { mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';

import { repoRoot } from './paths.js';
import { run } from './run.js';

export const PUBLISHED_PACKAGES = ['babel', 'codestyle', 'compiler', 'starter', 'tester', 'tsconfig', 'utils'] as const;

// npm pack every published package into outDir; returns package name -> tarball path.
export const packPackages = async (outDir = path.join(repoRoot, 'e2e/.tarballs')): Promise<Map<string, string>> => {
  rmSync(outDir, { force: true, recursive: true });
  mkdirSync(outDir, { recursive: true });
  const tarballs = new Map<string, string>();
  for (const name of PUBLISHED_PACKAGES) {
    const { code, output } = await run('npm', ['pack', '--pack-destination', outDir, '--json'], {
      cwd: path.join(repoRoot, 'packages', name),
      timeout: 300_000,
    });
    if (code !== 0) {
      throw new Error(`npm pack failed for ${name}\n${output}`);
    }
    const [info] = JSON.parse(output.slice(output.indexOf('['))) as { filename: string }[];
    if (!info) {
      throw new Error(`npm pack printed no result for ${name}`);
    }
    tarballs.set(`@rockpack/${name}`, path.join(outDir, info.filename));
  }

  return tarballs;
};

// Latest mode: points the @rockpack/* dependencies of a project at the local tarballs.
export const useTarballs = (
  deps: Readonly<Record<string, string>> | undefined,
  tarballs: ReadonlyMap<string, string>,
): Record<string, string> | undefined =>
  deps &&
  Object.fromEntries(
    Object.entries(deps).map(([name, version]) => [
      name,
      tarballs.has(name) ? `file:${tarballs.get(name) ?? ''}` : version,
    ]),
  );
