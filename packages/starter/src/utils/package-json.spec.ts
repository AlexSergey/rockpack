import { tmpdir } from 'node:os';

import type * as PackageJsonModule from './package-json.js';

import { packageJson } from './package-json.js';

describe('packageJson', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('does not depend on the working directory', () => {
      jest.spyOn(process, 'cwd').mockReturnValue(tmpdir());
      let loaded: typeof PackageJsonModule | undefined;
      jest.isolateModules(() => {
        loaded = jest.requireActual<typeof PackageJsonModule>('./package-json.js');
      });

      expect(loaded?.packageJson.name).toBe('@rockpack/starter');
    });
  });

  describe('positive cases', () => {
    it('exposes the starter name and semver version', () => {
      expect(packageJson.name).toBe('@rockpack/starter');
      expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+/);
    });
  });
});
