import os from 'node:os';

import type * as Mocks from '../__fixtures__/mocks.js';

import { ReportedError, showError } from './error.js';

jest.mock('chalk', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').chalkModule);
jest.mock('./other.js', () => ({ getPM: (): string => 'npm', getPMVersion: (): string => '11.6.0' }));

describe('showError', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('throws a ReportedError caused by the error', () => {
      const error = new Error('boom');

      let thrown: unknown;
      try {
        showError(error);
      } catch (e) {
        thrown = e;
      }

      expect(thrown).toBeInstanceOf(ReportedError);
      expect(thrown).toMatchObject({ cause: error, name: 'ReportedError' });
    });
  });

  describe('positive cases', () => {
    it('prints the error with platform diagnostics', () => {
      const error = new Error('boom');

      expect(() => showError(error)).toThrow(ReportedError);
      expect(logSpy).toHaveBeenCalledWith(error);
      expect(logSpy).toHaveBeenCalledWith(`OS: ${os.type()}, ${os.release()}, ${os.platform()}`);
      expect(logSpy).toHaveBeenCalledWith(`NodeJS version: ${process.versions.node}`);
      expect(logSpy).toHaveBeenCalledWith('Package manager: npm. version: 11.6.0');
    });

    it('runs the callback before throwing', () => {
      const callback = jest.fn();

      expect(() => showError(new Error('boom'), callback)).toThrow(ReportedError);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
