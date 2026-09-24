import { spawnSync } from 'node:child_process';

import { gitHooks } from './git-hooks.js';
import { getPM } from './other.js';

jest.mock('node:child_process', () => ({ spawnSync: jest.fn() }));
jest.mock('./other.js', () => ({ getPM: jest.fn() }));

const spawnSyncMock = spawnSync as jest.MockedFunction<typeof spawnSync>;
const getPMMock = getPM as jest.MockedFunction<typeof getPM>;

describe('gitHooks', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('runs nothing but simple-git-hooks', () => {
      getPMMock.mockReturnValue('npm');

      gitHooks('/work/app');

      expect(spawnSyncMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('positive cases', () => {
    it('installs the hooks with npx', () => {
      getPMMock.mockReturnValue('npm');

      gitHooks('/work/app');

      expect(spawnSyncMock).toHaveBeenCalledWith('npx', ['simple-git-hooks'], { cwd: '/work/app' });
    });

    it('installs the hooks with yarn', () => {
      getPMMock.mockReturnValue('yarn');

      gitHooks('/work/app');

      expect(spawnSyncMock).toHaveBeenCalledWith('yarn', ['simple-git-hooks'], { cwd: '/work/app' });
    });
  });
});
