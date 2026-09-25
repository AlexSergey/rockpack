import confirm from '@inquirer/confirm';
import select from '@inquirer/select';

import type * as Mocks from '../__fixtures__/mocks.js';

import { wizard } from './wizard.js';

jest.mock('chalk', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').chalkModule);
jest.mock('@inquirer/select', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('@inquirer/confirm', () => ({ __esModule: true, default: jest.fn() }));

const selectMock = select as unknown as jest.Mock<Promise<string>>;
const confirmMock = confirm as unknown as jest.Mock<Promise<boolean>>;

const exitPromptError = (): Error =>
  Object.assign(new Error('User force closed the prompt'), { name: 'ExitPromptError' });

describe('wizard', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('rethrows the prompt exit when the type prompt is closed', async () => {
      selectMock.mockRejectedValue(exitPromptError());

      await expect(wizard({ tests: true })).rejects.toMatchObject({ name: 'ExitPromptError' });
    });

    it('rethrows the prompt exit when the tests prompt is closed', async () => {
      confirmMock.mockRejectedValue(exitPromptError());

      await expect(wizard({ appType: 'csr' })).rejects.toMatchObject({ name: 'ExitPromptError' });
    });

    it('leaves the answers undefined when the prompts fail for another reason', async () => {
      selectMock.mockRejectedValue(new Error('no tty'));
      confirmMock.mockRejectedValue(new Error('no tty'));

      await expect(wizard({})).resolves.toEqual({ appType: undefined, tester: undefined });
    });
  });

  describe('positive cases', () => {
    it('answers the open questions with the defaults under --yes', async () => {
      await expect(wizard({ yes: true })).resolves.toEqual({ appType: 'csr', tester: true });
      expect(selectMock).not.toHaveBeenCalled();
      expect(confirmMock).not.toHaveBeenCalled();
    });

    it('prefers the arguments over the --yes defaults', async () => {
      await expect(wizard({ appType: 'library', tests: false, yes: true })).resolves.toEqual({
        appType: 'library',
        tester: false,
      });
    });

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
