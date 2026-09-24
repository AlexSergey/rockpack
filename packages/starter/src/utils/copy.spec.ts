import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { copy } from './copy';

describe('copy', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'rockpack-starter-'));
  });

  afterEach(() => {
    rmSync(dir, { force: true, recursive: true });
  });

  describe('negative cases', () => {
    it('rejects when the source does not exist', async () => {
      await expect(copy(path.join(dir, 'missing'), path.join(dir, 'dest'))).rejects.toMatchObject({ code: 'ENOENT' });
    });
  });

  describe('positive cases', () => {
    it('copies a single file', async () => {
      writeFileSync(path.join(dir, 'file.txt'), 'content');

      await copy(path.join(dir, 'file.txt'), path.join(dir, 'copy.txt'));

      expect(readFileSync(path.join(dir, 'copy.txt'), 'utf8')).toBe('content');
    });

    it('copies nested directories and files into an existing destination', async () => {
      mkdirSync(path.join(dir, 'src', 'nested', 'deep'), { recursive: true });
      writeFileSync(path.join(dir, 'src', 'root.txt'), 'root');
      writeFileSync(path.join(dir, 'src', 'nested', 'deep', 'leaf.txt'), 'leaf');
      mkdirSync(path.join(dir, 'dest'));

      await copy(path.join(dir, 'src'), path.join(dir, 'dest'));

      expect(readFileSync(path.join(dir, 'dest', 'root.txt'), 'utf8')).toBe('root');
      expect(readFileSync(path.join(dir, 'dest', 'nested', 'deep', 'leaf.txt'), 'utf8')).toBe('leaf');
      expect(existsSync(path.join(dir, 'src', 'root.txt'))).toBe(true);
    });
  });
});
