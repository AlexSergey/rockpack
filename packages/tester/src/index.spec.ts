import { setMode } from '@rockpack/utils';

import { init } from './core/init.js';
import { tester } from './index.js';

jest.mock('@rockpack/utils', () => ({ setMode: jest.fn() }));
jest.mock('./core/init.js', () => ({ init: jest.fn() }));

const setModeMock = setMode as jest.MockedFunction<typeof setMode>;
const initMock = init as jest.MockedFunction<typeof init>;

const flushPromises = async (): Promise<void> => {
  await new Promise(process.nextTick);
};

describe('tester', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('logs a rejected init instead of throwing', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      const error = new Error('init failed');
      initMock.mockRejectedValue(error);

      expect(() => tester()).not.toThrow();
      await flushPromises();

      expect(errorSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('positive cases', () => {
    it('switches to test mode before running jest', () => {
      initMock.mockResolvedValue();

      tester();

      expect(setModeMock).toHaveBeenCalledWith(['development', 'production', 'test'], 'test');
      expect(setModeMock.mock.invocationCallOrder[0]).toBeLessThan(initMock.mock.invocationCallOrder[0] ?? 0);
    });

    it('passes the options and project config to init', () => {
      initMock.mockResolvedValue();
      const opts = { watch: true };
      const projectConfig = { testEnvironment: 'node' };

      tester(opts, projectConfig);

      expect(initMock).toHaveBeenCalledWith(opts, projectConfig);
    });

    it('defaults the options and project config to empty objects', () => {
      initMock.mockResolvedValue();

      tester();

      expect(initMock).toHaveBeenCalledWith({}, {});
    });
  });
});
