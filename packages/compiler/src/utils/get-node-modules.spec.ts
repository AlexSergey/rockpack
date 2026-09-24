import finder from 'find-package-json';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { getNodeModules } from './get-node-modules.js';

jest.mock('find-package-json', () => jest.fn());
jest.mock('node:fs', () => ({ existsSync: jest.fn() }));

const finderMock = finder as unknown as jest.Mock;
const existsSyncMock = existsSync as jest.MockedFunction<typeof existsSync>;

const mockPackageJsons = (...filenames: string[]): void => {
  const results = [...filenames.map((filename) => ({ done: false, filename })), { done: true }];
  finderMock.mockReturnValue({ next: jest.fn(() => results.shift()) });
};

describe('getNodeModules', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('returns nothing without package.json files', () => {
      mockPackageJsons();

      expect(getNodeModules('/repo/app')).toEqual([]);
    });

    it('skips packages without node_modules', () => {
      mockPackageJsons('/repo/app/package.json', '/repo/package.json');
      existsSyncMock.mockImplementation((dir) => dir === path.resolve('/repo', 'node_modules'));

      expect(getNodeModules('/repo/app')).toEqual([path.resolve('/repo', 'node_modules')]);
    });
  });

  describe('positive cases', () => {
    it('collects node_modules of every package.json up the tree', () => {
      mockPackageJsons('/repo/app/package.json', '/repo/package.json');
      existsSyncMock.mockReturnValue(true);

      expect(getNodeModules('/repo/app')).toEqual([
        path.resolve('/repo/app', 'node_modules'),
        path.resolve('/repo', 'node_modules'),
      ]);
      expect(finderMock).toHaveBeenCalledWith('/repo/app');
    });
  });
});
