import { isString } from './index';

// These plugins are ESM-only and cannot be loaded by babel-jest's CJS output.
// @eslint-react/eslint-plugin has no "require" export condition at all, hence the virtual mock.
jest.mock('@eslint-react/eslint-plugin', () => ({}), { virtual: true });
jest.mock('@eslint/json', () => ({}));
jest.mock('eslint-config-flat-gitignore', () => ({}));
jest.mock('eslint-plugin-import-lite', () => ({}));
jest.mock('eslint-plugin-package-json', () => ({}));
jest.mock('eslint-plugin-perfectionist', () => ({}));
jest.mock('eslint-plugin-regexp', () => ({}));
jest.mock('eslint-plugin-unicorn', () => ({}));

describe('isString', () => {
  describe('negative cases', () => {
    it('returns false for non-string values', () => {
      expect([undefined, null, 1, {}, []].some((value) => isString(value))).toBe(false);
    });
  });

  describe('positive cases', () => {
    it('returns true for strings', () => {
      expect(isString('')).toBe(true);
    });
  });
});
