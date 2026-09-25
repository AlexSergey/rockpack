import { compilerLabel } from './compiler-name.js';

describe('compilerLabel', () => {
  describe('negative cases', () => {
    it('falls back to build for an unknown compiler', () => {
      expect(compilerLabel({})).toBe('build');
      expect(compilerLabel({ compilerName: 'customCompiler' })).toBe('build');
    });
  });

  describe('positive cases', () => {
    it('names the isomorphic halves client and server', () => {
      expect(compilerLabel({ __isIsomorphicFrontend: true, compilerName: 'frontendCompiler' })).toBe('client');
      expect(compilerLabel({ __isIsomorphicBackend: true, compilerName: 'backendCompiler' })).toBe('server');
    });

    it.each([
      ['frontendCompiler', 'frontend'],
      ['backendCompiler', 'backend'],
      ['libraryCompiler', 'library'],
    ])('names %s %s', (compilerName, label) => {
      expect(compilerLabel({ compilerName })).toBe(label);
    });
  });
});
