import type * as Mocks from '../__fixtures__/mocks.js';
import type { State } from './wizard.js';

import { findGitRepoInParent, gitIsAvailable, makeRepo } from '../utils/git.js';
import { gitInit } from './git-init.js';

jest.mock('chalk', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').chalkModule);
jest.mock('../utils/git.js', () => ({
  findGitRepoInParent: jest.fn(),
  gitIsAvailable: jest.fn(),
  makeRepo: jest.fn(),
}));

const gitIsAvailableMock = gitIsAvailable as jest.MockedFunction<typeof gitIsAvailable>;
const findGitRepoInParentMock = findGitRepoInParent as jest.MockedFunction<typeof findGitRepoInParent>;
const makeRepoMock = makeRepo as jest.MockedFunction<typeof makeRepo>;

const createState = (): State => ({ appType: 'csr', tester: true });

describe('gitInit', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('disables git when it is not installed', () => {
      gitIsAvailableMock.mockReturnValue(false);
      const state = createState();

      gitInit('/work/app', state);

      expect(state.nogit).toBe(true);
      expect(warnSpy).toHaveBeenCalledWith('WARNING:   GIT is not available in the system.');
      expect(makeRepoMock).not.toHaveBeenCalled();
    });

    it('disables git inside an existing repository', () => {
      gitIsAvailableMock.mockReturnValue(true);
      findGitRepoInParentMock.mockReturnValue(true);
      const state = createState();

      gitInit('/work/app', state);

      expect(state.nogit).toBe(true);
      expect(makeRepoMock).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('creates a repository in the project directory', () => {
      gitIsAvailableMock.mockReturnValue(true);
      findGitRepoInParentMock.mockReturnValue(false);
      const state = createState();

      gitInit('/work/app', state);

      expect(findGitRepoInParentMock).toHaveBeenCalledWith('/work/app');
      expect(makeRepoMock).toHaveBeenCalledWith('/work/app');
      expect(state.nogit).toBeUndefined();
    });
  });
});
