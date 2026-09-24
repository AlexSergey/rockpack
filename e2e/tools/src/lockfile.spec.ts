import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { pinToLockfile, readLockedVersions } from './lockfile.js';

describe('lockfile', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'rockpack-e2e-tools-'));
  });

  afterEach(() => {
    rmSync(dir, { force: true, recursive: true });
  });

  describe('negative cases', () => {
    it('ignores nested and workspace entries of the lockfile', () => {
      const lockfile = path.join(dir, 'package-lock.json');
      writeFileSync(
        lockfile,
        JSON.stringify({
          packages: {
            '': { version: '1.0.0' },
            'node_modules/a/node_modules/react': { version: '18.0.0' },
            'node_modules/react': { version: '19.3.0' },
            'packages/utils': { version: '8.0.0' },
          },
        }),
      );

      expect([...readLockedVersions(lockfile)]).toEqual([['react', '19.3.0']]);
    });

    it('reports dependencies the lockfile does not know and keeps @rockpack versions', () => {
      const { missing, packageJson } = pinToLockfile(
        { dependencies: { '@rockpack/compiler': '8.0.0', 'left-pad': '^1.0.0' } },
        new Map(),
      );

      expect(missing).toEqual(['left-pad']);
      expect(packageJson['dependencies']).toEqual({ '@rockpack/compiler': '8.0.0', 'left-pad': '^1.0.0' });
    });
  });

  describe('positive cases', () => {
    it('reads scoped and unscoped root packages', () => {
      const lockfile = path.join(dir, 'package-lock.json');
      writeFileSync(
        lockfile,
        JSON.stringify({
          packages: { 'node_modules/@types/react': { version: '19.3.0' }, 'node_modules/tsx': { version: '4.23.15' } },
        }),
      );

      expect(readLockedVersions(lockfile)).toEqual(
        new Map([
          ['@types/react', '19.3.0'],
          ['tsx', '4.23.15'],
        ]),
      );
    });

    it('lets the nested node_modules of a workspace override the root', () => {
      const lockfile = path.join(dir, 'package-lock.json');
      writeFileSync(
        lockfile,
        JSON.stringify({
          packages: {
            'e2e/app/node_modules/jest-dom': { version: '7.0.0' },
            'node_modules/jest-dom': { version: '6.0.0' },
            'node_modules/react': { version: '19.3.0' },
          },
        }),
      );

      expect(readLockedVersions(lockfile, ['e2e/app'])).toEqual(
        new Map([
          ['jest-dom', '7.0.0'],
          ['react', '19.3.0'],
        ]),
      );
    });

    it('pins dependencies and devDependencies to the locked versions', () => {
      const { missing, packageJson } = pinToLockfile(
        { dependencies: { react: '19.0.0' }, devDependencies: { tsx: '4.0.0' }, name: 'app' },
        new Map([
          ['react', '19.3.0'],
          ['tsx', '4.23.15'],
        ]),
      );

      expect(missing).toEqual([]);
      expect(packageJson).toEqual({
        dependencies: { react: '19.3.0' },
        devDependencies: { tsx: '4.23.15' },
        name: 'app',
      });
    });
  });
});
