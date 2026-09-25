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
    it.each(['.stylelintrc', '.stylelintrc.json', '.stylelintrc.cjs', 'stylelint.config.mjs'])('finds %s', (name) => {
      mockFiles(name);

      expect(pathToStylelint(root)).toBe(path.resolve(root, name));
    });

    it('takes the first config in Stylelint order', () => {
      mockFiles('stylelint.config.js', '.stylelintrc.cjs');

      expect(pathToStylelint(root)).toBe(path.resolve(root, '.stylelintrc.cjs'));
    });
  });
});
