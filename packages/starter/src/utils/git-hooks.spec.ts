import { spawnSync } from 'node:child_process';

import { gitHooks } from './git-hooks';

jest.mock('node:child_process', () => ({ spawnSync: jest.fn() }));
jest.mock('./other', () => ({ getPM: (): string => 'npm' }));

const spawnSyncMock = spawnSync as jest.MockedFunction<typeof spawnSync>;
const shellOptions = { cwd: '/work/app' };

// These husky 4-style commands do not work with npm 9+ and husky 9; Plan 3 replaces them.
const setupCalls = [
  ['npm', ['set-script', 'prepare', '"husky init"'], shellOptions],
  ['npm', ['run', 'prepare'], shellOptions],
  ['npx', ['husky', 'add', '.husky/pre-commit', '"npm run pre-commit"'], shellOptions],
  ['git', ['add', '.husky/pre-commit'], shellOptions],
];
const commitMsgCalls = [
  ['npx', ['husky', 'add', '.husky/commit-msg', '"npm run lint:commit"'], shellOptions],
  ['git', ['add', '.husky/commit-msg'], shellOptions],
];

describe('gitHooks', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('adds no pre-push hook without tests', () => {
      gitHooks({ tester: false }, '/work/app');

      expect(spawnSyncMock.mock.calls).toEqual([...setupCalls, ...commitMsgCalls]);
    });
  });

  describe('positive cases', () => {
    it('adds a pre-push hook that runs the tests', () => {
      gitHooks({ tester: true }, '/work/app');

      expect(spawnSyncMock.mock.calls).toEqual([
        ...setupCalls,
        ['npx', ['husky', 'add', '.husky/pre-push', '"npm test"'], shellOptions],
        ['git', ['add', '.husky/pre-push'], shellOptions],
        ...commitMsgCalls,
      ]);
    });
  });
});
