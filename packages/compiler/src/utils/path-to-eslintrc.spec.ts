import { existsSync } from 'node:fs';
import path from 'node:path';

import { pathToEslintrc } from './path-to-eslintrc.js';

jest.mock('node:fs', () => ({ existsSync: jest.fn() }));

const existsSyncMock = existsSync as jest.MockedFunction<typeof existsSync>;
const root = '/project';

const mockFiles = (...files: string[]): void => {
  existsSyncMock.mockImplementation((file) => files.map((name) => path.resolve(root, name)).includes(String(file)));
};

describe('pathToEslintrc', () => {
  describe('negative cases', () => {
    it('returns false when there is no flat config', () => {
      mockFiles('.eslintrc.json');

      expect(pathToEslintrc(root)).toBe(false);
    });
  });

  describe('positive cases', () => {
    it.each(['.js', '.json', '.mjs', '.cjs'])('finds eslint.config%s', (ext) => {
      mockFiles(`eslint.config${ext}`);

      expect(pathToEslintrc(root)).toBe(path.resolve(root, `eslint.config${ext}`));
    });

    it('lets the last matching extension win', () => {
      mockFiles('eslint.config.js', 'eslint.config.cjs');

      expect(pathToEslintrc(root)).toBe(path.resolve(root, 'eslint.config.cjs'));
    });
  });
});
