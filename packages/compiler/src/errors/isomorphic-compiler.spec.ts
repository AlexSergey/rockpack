import { backendIsRequired, distsMustDiffer, frontendIsRequired } from './isomorphic-compiler.js';

describe('isomorphic compiler errors', () => {
  describe('negative cases', () => {
    it('explains which compilers are missing', () => {
      expect([backendIsRequired(), frontendIsRequired()].map((e) => e.message)).toEqual([
        'backendCompiler is required to set isomorphicCompiler',
        'frontendCompiler is required to set isomorphicCompiler',
      ]);
    });
  });

  describe('positive cases', () => {
    it('reports colliding outputs as invalid configuration', () => {
      expect(distsMustDiffer()).toMatchObject({
        code: 'INVALID_CONFIG',
        message:
          'frontendCompiler and backendCompiler write to the same file: set a different dist, for example public for the frontend',
      });
    });
  });
});
