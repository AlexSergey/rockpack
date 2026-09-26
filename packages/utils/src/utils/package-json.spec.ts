import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { readPackageJson } from './package-json.js';

describe('readPackageJson', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'rockpack-utils-'));
  });

  afterEach(() => {
    rmSync(dir, { force: true, recursive: true });
  });

  describe('negative cases', () => {
    it('returns undefined when package.json is missing', () => {
      expect(readPackageJson(dir)).toBeUndefined();
    });

    it('returns undefined when package.json is malformed', () => {
      writeFileSync(path.join(dir, 'package.json'), '{ "name": ');

      expect(readPackageJson(dir)).toBeUndefined();
    });
  });

  describe('positive cases', () => {
    it('parses package.json from the directory', () => {
      writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { react: '19' }, name: 'app' }));

      expect(readPackageJson(dir)).toEqual({ dependencies: { react: '19' }, name: 'app' });
    });

    it('reads peerDependencies and engines as typed fields', () => {
      writeFileSync(
        path.join(dir, 'package.json'),
        JSON.stringify({ engines: { node: '>=24.15.0' }, peerDependencies: { react: '^19.0.0' } }),
      );
      const packageJson = readPackageJson(dir);
      const node: string | undefined = packageJson?.engines?.['node'];
      const react: string | undefined = packageJson?.peerDependencies?.['react'];

      expect({ node, react }).toEqual({ node: '>=24.15.0', react: '^19.0.0' });
    });
  });
});
