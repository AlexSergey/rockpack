import path from 'node:path';

import { ExitError, mockProcessExit } from '../__fixtures__/process-exit.js';
import { makeEntry } from './make-entry.js';

describe('makeEntry', () => {
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockProcessExit();
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('exits when src is not a string', () => {
      expect(() => makeEntry({ src: 42 as unknown as string }, '/project', 'production')).toThrow(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith('Src must be a string!');
    });

    it('adds no dev-server entry to an isomorphic frontend in production', () => {
      const { entry } = makeEntry({ __isIsomorphicFrontend: true, src: 'src/index.tsx' }, '/project', 'production');

      expect(entry).not.toHaveProperty('dev-server');
    });

    it('adds no dev-server entry to a regular frontend in development', () => {
      expect(makeEntry({ src: 'src/index.tsx' }, '/project', 'development').entry).not.toHaveProperty('dev-server');
    });
  });

  describe('positive cases', () => {
    it('names the entry after the dist basename and uses the src folder as context', () => {
      expect(makeEntry({ dist: 'build/app.js', src: 'src/index.tsx' }, '/project', 'production')).toEqual({
        context: path.resolve('/project', 'src'),
        entry: { app: path.resolve('/project', 'src/index.tsx') },
      });
    });

    it('defaults the entry name to index without dist', () => {
      expect(Object.keys(makeEntry({ src: 'src/index.tsx' }, '/project', 'production').entry)).toEqual(['index']);
    });

    it('adds a vendor entry', () => {
      const { entry } = makeEntry({ src: 'src/index.tsx', vendor: ['react', 'react-dom'] }, '/project', 'production');

      expect(entry['vendor']).toEqual(['react', 'react-dom']);
    });

    it('adds the live reload client to an isomorphic frontend in development', () => {
      const { entry } = makeEntry({ __isIsomorphicFrontend: true, src: 'src/index.tsx' }, '/project', 'development');

      expect(entry['dev-server']).toBe(path.resolve(__dirname, '../plugins/reloader/ssr.cjs'));
    });
  });
});
