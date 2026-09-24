import path from 'node:path';

import { currentDir, currentFile } from './current-file';

describe('module-level __filename from import.meta.url under @rockpack/tester', () => {
  describe('negative cases', () => {
    it('does not resolve to the spec file', () => {
      expect(path.basename(currentFile())).not.toBe('current-file.spec.ts');
    });
  });

  describe('positive cases', () => {
    it('resolves the module file and folder', () => {
      expect(path.basename(currentFile())).toBe('current-file.ts');
      expect(currentDir()).toBe(__dirname);
    });
  });
});
