import type * as Mocks from '../__fixtures__/mocks.js';

import { ExitError, mockProcessExit } from '../__fixtures__/process-exit.js';

jest.mock('chalk', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').chalkModule);
jest.mock('./rockpack.js', () => ({ rockpack: jest.fn() }));

const originalNodeVersion = process.versions.node;

const runBin = (nodeVersion: string): jest.Mock => {
  Object.defineProperty(process.versions, 'node', { value: nodeVersion });
  let rockpack: jest.Mock | undefined;
  jest.isolateModules(() => {
    rockpack = jest.requireMock<{ rockpack: jest.Mock }>('./rockpack.js').rockpack;
    rockpack.mockResolvedValue(undefined);
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
    mockProcessExit();
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    Object.defineProperty(process.versions, 'node', { value: originalNodeVersion });
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('exits with code 1 on Node below the minimum version', () => {
      expect(() => runBin('23.11.0')).toThrow(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('You are running Node 23.11.0.'));
    });
  });

  describe('positive cases', () => {
    it('starts the CLI on a supported Node version', () => {
      const rockpack = runBin('24.0.0');

      expect(rockpack).toHaveBeenCalledTimes(1);
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });
});
