import { moduleFile } from './module-info';

// Top-level await is valid only in an ES module: this file would not even parse as CommonJS.
const loaded = await Promise.resolve('loaded');

describe('module-info', () => {
  describe('negative cases', () => {
    it('does not see a CommonJS __filename', () => {
      expect(typeof (globalThis as { __filename?: string }).__filename).toBe('undefined');
    });
  });

  describe('positive cases', () => {
    it('runs the spec as an ES module', () => {
      expect(loaded).toBe('loaded');
    });

    it('reads import.meta.url of the module under test', () => {
      expect(moduleFile()).toBe('module-info.ts');
    });
  });
});
