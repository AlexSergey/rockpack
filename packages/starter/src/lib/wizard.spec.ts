import confirm from '@inquirer/confirm';
import select from '@inquirer/select';

import type * as Mocks from '../__fixtures__/mocks';

import { ExitError, mockProcessExit } from '../__fixtures__/process-exit';
import { wizard } from './wizard';

jest.mock('chalk', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks').chalkModule);
jest.mock('@inquirer/select', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('@inquirer/confirm', () => ({ __esModule: true, default: jest.fn() }));

const selectMock = select as unknown as jest.Mock<Promise<string>>;
const confirmMock = confirm as unknown as jest.Mock<Promise<boolean>>;

const exitPromptError = (): Error =>
  Object.assign(new Error('User force closed the prompt'), { name: 'ExitPromptError' });

describe('wizard', () => {
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    exitSpy = mockProcessExit();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('exits with code 0 when the type prompt is closed', async () => {
      selectMock.mockRejectedValue(exitPromptError());

      await expect(wizard({ tests: true })).rejects.toEqual(new ExitError(0));
      expect(exitSpy).toHaveBeenCalledWith(0);
    });

    it('exits with code 0 when the tests prompt is closed', async () => {
      confirmMock.mockRejectedValue(exitPromptError());

      await expect(wizard({ appType: 'csr' })).rejects.toEqual(new ExitError(0));
    });

    it('leaves the answers undefined when the prompts fail for another reason', async () => {
      selectMock.mockRejectedValue(new Error('no tty'));
      confirmMock.mockRejectedValue(new Error('no tty'));

      await expect(wizard({})).resolves.toEqual({ appType: undefined, tester: undefined });
      expect(exitSpy).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('skips the prompts when the answers come from arguments', async () => {
      await expect(wizard({ appType: 'library', tests: false })).resolves.toEqual({
        appType: 'library',
        tester: false,
      });
      expect(selectMock).not.toHaveBeenCalled();
      expect(confirmMock).not.toHaveBeenCalled();
    });

    it('asks for the project type', async () => {
      selectMock.mockResolvedValue('ssr');

      const state = await wizard({ tests: true });

      expect(state.appType).toBe('ssr');
      expect(selectMock).toHaveBeenCalledWith({
        choices: [
          expect.objectContaining({ value: 'csr' }),
          expect.objectContaining({ value: 'ssr' }),
          expect.objectContaining({ value: 'component' }),
          expect.objectContaining({ value: 'library' }),
        ],
        message: 'Which is type of application would you build?',
      });
    });

    it('asks whether to add tests', async () => {
      confirmMock.mockResolvedValue(true);

      const state = await wizard({ appType: 'csr' });

      expect(state.tester).toBe(true);
      expect(confirmMock).toHaveBeenCalledWith({ message: 'Do you want tests?' });
    });
  });
});
