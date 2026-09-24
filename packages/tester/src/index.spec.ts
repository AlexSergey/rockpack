import { setMode } from '@rockpack/utils';

import { init } from './core/init.js';
import { tester } from './index.js';

jest.mock('@rockpack/utils', () => ({ setMode: jest.fn() }));
jest.mock('./core/init.js', () => ({ init: jest.fn() }));

const setModeMock = setMode as jest.MockedFunction<typeof setMode>;
const initMock = init as jest.MockedFunction<typeof init>;

describe('tester', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('resolves to undefined when jest could not run', async () => {
      initMock.mockResolvedValue(undefined);

      await expect(tester()).resolves.toBeUndefined();
    });
  });

  describe('positive cases', () => {
    it('resolves to the jest results', async () => {
      const results = { success: true } as Awaited<ReturnType<typeof init>>;
      initMock.mockResolvedValue(results);

      await expect(tester()).resolves.toBe(results);
    });

    it('switches to test mode before running jest', async () => {
      initMock.mockResolvedValue(undefined);

      await tester();

      expect(setModeMock).toHaveBeenCalledWith(['development', 'production', 'test'], 'test');
      expect(setModeMock.mock.invocationCallOrder[0]).toBeLessThan(initMock.mock.invocationCallOrder[0] ?? 0);
    });

    it('passes the options and project config to init', async () => {
      initMock.mockResolvedValue(undefined);
      const opts = { watch: true };
      const projectConfig = { testEnvironment: 'node' };

      await tester(opts, projectConfig);

      expect(initMock).toHaveBeenCalledWith(opts, projectConfig);
    });

    it('turns positional command line arguments into spec path patterns', async () => {
      initMock.mockResolvedValue(undefined);
      const originalArgv = process.argv;
      process.argv = ['node', 'scripts.tests.ts', 'cli', '--watch', 'generation'];

      try {
        await tester();
      } finally {
        process.argv = originalArgv;
      }

      expect(initMock).toHaveBeenCalledWith({ testPathPatterns: ['cli', 'generation'], watch: true }, {});
    });

    it('defaults to no watch and an empty project config', async () => {
      initMock.mockResolvedValue(undefined);

      await tester();

      expect(initMock).toHaveBeenCalledWith({ watch: false }, {});
    });

    it('reads --watch from the command line when watch is not passed', async () => {
      initMock.mockResolvedValue(undefined);
      const originalArgv = process.argv;
      process.argv = ['node', 'scripts.tests.ts', '--watch'];

      try {
        await tester({ src: './app' });
      } finally {
        process.argv = originalArgv;
      }

      expect(initMock).toHaveBeenCalledWith({ src: './app', watch: true }, {});
    });

    it('lets an explicit watch option win over the command line', async () => {
      initMock.mockResolvedValue(undefined);
      const originalArgv = process.argv;
      process.argv = ['node', 'scripts.tests.ts', '--watch'];

      try {
        await tester({ watch: false });
      } finally {
        process.argv = originalArgv;
      }

      expect(initMock).toHaveBeenCalledWith({ watch: false }, {});
    });
  });
});
