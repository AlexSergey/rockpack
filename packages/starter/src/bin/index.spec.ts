import type * as Mocks from '../__fixtures__/mocks.js';

jest.mock('chalk', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').chalkModule);
jest.mock('./rockpack.js', () => ({ rockpack: jest.fn() }));

const originalNodeVersion = process.versions.node;

const runBin = (nodeVersion: string): jest.Mock => {
  Object.defineProperty(process.versions, 'node', { value: nodeVersion });
  let rockpack: jest.Mock | undefined;
  jest.isolateModules(() => {
    rockpack = jest.requireMock<{ rockpack: jest.Mock }>('./rockpack.js').rockpack;
    rockpack.mockResolvedValue(3);
    jest.requireActual('./index.js');
  });
  if (!rockpack) {
    throw new Error('./rockpack mock was not loaded');
  }

  return rockpack;
};

describe('bin', () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    Object.defineProperty(process.versions, 'node', { value: originalNodeVersion });
    process.exitCode = undefined;
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('sets exit code 1 and does not start the CLI on Node below the minimum version', () => {
      const rockpack = runBin('23.11.0');

      expect(process.exitCode).toBe(1);
      expect(rockpack).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('You are running Node 23.11.0.'));
    });

    it('refuses a Node 24 release older than the minimum minor version', () => {
      const rockpack = runBin('24.10.0');

      expect(process.exitCode).toBe(1);
      expect(rockpack).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Rockpack requires Node >=24.11.0.'));
    });
  });

  describe('positive cases', () => {
    it('starts the CLI and sets its exit code on a supported Node version', async () => {
      const rockpack = runBin('24.11.0');
      await Promise.resolve();

      expect(rockpack).toHaveBeenCalledTimes(1);
      expect(process.exitCode).toBe(3);
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });
});
