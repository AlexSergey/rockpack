import path from 'node:path';

import type { AppType } from './wizard.js';

import { copy } from '../utils/copy.js';
import { addons, backbone } from '../utils/pathes.js';
import { copyFiles } from './copy-files.js';

jest.mock('../utils/copy.js', () => ({ copy: jest.fn() }));

const copyMock = copy as jest.MockedFunction<typeof copy>;
const target = '/work/app';

const copiedSources = (): string[] => copyMock.mock.calls.map(([src]) => src);

describe('copyFiles', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('copies nothing without a project type', async () => {
      await copyFiles(target, { appType: undefined, tester: true });

      expect(copyMock).not.toHaveBeenCalled();
    });

    it('skips the git addon when git is disabled', async () => {
      await copyFiles(target, { appType: 'csr', nogit: true, tester: false });

      expect(copiedSources()).not.toContain(path.join(addons, 'git'));
    });

    it('skips the tester addons without tests', async () => {
      await copyFiles(target, { appType: 'csr', tester: false });

      expect(copiedSources().some((src) => src.startsWith(path.join(addons, 'tester')))).toBe(false);
    });
  });

  describe('positive cases', () => {
    it.each<AppType>(['csr', 'ssr', 'component', 'library'])(
      'copies the %s backbone and addons in order',
      async (appType) => {
        await copyFiles(target, { appType, tester: true });

        expect(copiedSources()).toEqual([
          path.join(backbone, appType),
          path.join(addons, 'claude'),
          path.join(addons, 'codestyle'),
          path.join(addons, 'git'),
          path.join(addons, 'tester', 'common'),
          path.join(addons, 'tester', appType),
        ]);
        expect(copyMock.mock.calls.every(([, dest]) => dest === target)).toBe(true);
      },
    );
  });
});
