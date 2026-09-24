import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { ExitError, mockProcessExit } from '../__fixtures__/process-exit.js';
import { findHtml } from './find-html.js';

describe('findHtml', () => {
  let dir: string;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'rockpack-compiler-'));
    writeFileSync(path.join(dir, 'index.html'), '');
    mockProcessExit();
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    rmSync(dir, { force: true, recursive: true });
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('exits when the pattern matches nothing', async () => {
      await expect(findHtml(path.join(dir, '*.ejs'))).rejects.toEqual(new ExitError(1));
      expect(errorSpy).toHaveBeenCalledWith('Invalid path');
    });
  });

  describe('positive cases', () => {
    it('turns matched files into pages', async () => {
      await expect(findHtml(path.join(dir, '*.html'))).resolves.toEqual([{ template: path.join(dir, 'index.html') }]);
    });

    it('prepends a single configured page', async () => {
      await expect(findHtml(path.join(dir, '*.html'), { title: 'App' })).resolves.toEqual([
        { title: 'App' },
        { template: path.join(dir, 'index.html') },
      ]);
    });

    it('prepends an array of configured pages', async () => {
      const pages = await findHtml(path.join(dir, '*.html'), [{ title: 'A' }, { title: 'B' }]);

      expect(pages).toHaveLength(3);
    });
  });
});
