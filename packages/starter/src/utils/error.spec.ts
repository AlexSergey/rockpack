import os from 'node:os';

import type * as Mocks from '../__fixtures__/mocks.js';

import { ExitError, mockProcessExit } from '../__fixtures__/process-exit.js';
import { showError } from './error.js';

jest.mock('chalk', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').chalkModule);
jest.mock('./other.js', () => ({ getPM: (): string => 'npm', getPMVersion: (): string => '11.6.0' }));

describe('showError', () => {
  let exitSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    exitSpy = mockProcessExit();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('exits with code 1', () => {
      expect(() => showError(new Error('boom'))).toThrow(new ExitError(1));
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('positive cases', () => {
    it('prints the error with platform diagnostics', () => {
      const error = new Error('boom');

      expect(() => showError(error)).toThrow(ExitError);
      expect(logSpy).toHaveBeenCalledWith(error);
      expect(logSpy).toHaveBeenCalledWith(`OS: ${os.type()}, ${os.release()}, ${os.platform()}`);
      expect(logSpy).toHaveBeenCalledWith(`NodeJS version: ${process.versions.node}`);
      expect(logSpy).toHaveBeenCalledWith('Package manager: npm. version: 11.6.0');
    });

    it('runs the callback before exiting', () => {
      const callback = jest.fn();

      expect(() => showError(new Error('boom'), callback)).toThrow(ExitError);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback.mock.invocationCallOrder[0]).toBeLessThan(exitSpy.mock.invocationCallOrder[0] ?? 0);
    });
  });
});
