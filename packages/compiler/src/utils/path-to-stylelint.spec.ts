import { existsSync } from 'node:fs';
import path from 'node:path';

import { pathToStylelint } from './path-to-stylelint.js';

jest.mock('node:fs', () => ({ existsSync: jest.fn() }));

const existsSyncMock = existsSync as jest.MockedFunction<typeof existsSync>;
const root = '/project';

const mockFiles = (...files: string[]): void => {
  existsSyncMock.mockImplementation((file) => files.map((name) => path.resolve(root, name)).includes(String(file)));
};

describe('pathToStylelint', () => {
  describe('negative cases', () => {
    it('returns false without a stylelint config', () => {
      mockFiles();

      expect(pathToStylelint(root)).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('finds .stylelintrc', () => {
      mockFiles('.stylelintrc');

      expect(pathToStylelint(root)).toBe(path.resolve(root, '.stylelintrc'));
    });

    it('prefers stylelint.config.js over .stylelintrc', () => {
      mockFiles('.stylelintrc', 'stylelint.config.js');

      expect(pathToStylelint(root)).toBe(path.resolve(root, 'stylelint.config.js'));
    });
  });
});
