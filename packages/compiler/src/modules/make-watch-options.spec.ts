import path from 'node:path';

import { makeWatchOptions } from './make-watch-options.js';

describe('makeWatchOptions', () => {
  describe('negative cases', () => {
    it('keeps watching an output folder that holds the sources', () => {
      expect(makeWatchOptions('/project', ['/project'], ['/project/src']).ignored).toEqual([
        '/project/node_modules/.cache',
      ]);
    });

    it('keeps watching an output folder that is the source folder', () => {
      expect(makeWatchOptions('/project', ['/project/src'], ['/project/src']).ignored).not.toContain('/project/src');
    });
  });

  describe('positive cases', () => {
    it('ignores the output folders and the caches', () => {
      expect(makeWatchOptions('/project', ['/project/public', '/project/dist'], ['/project/src']).ignored).toEqual([
        '/project/public',
        '/project/dist',
        '/project/node_modules/.cache',
      ]);
    });

    it('ignores an output folder inside the source folder', () => {
      expect(makeWatchOptions('/project', ['/project/src/dist'], ['/project/src']).ignored).toContain(
        '/project/src/dist',
      );
    });

    it('lists every folder once', () => {
      const cache = path.join('/project', 'node_modules', '.cache');

      expect(makeWatchOptions('/project', [cache], ['/project/src']).ignored).toEqual(['/project/node_modules/.cache']);
    });
  });
});
