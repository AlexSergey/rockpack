import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DEFAULT_IGNORED = ['.git', 'node_modules'];

// Sorted relative paths of every file under dir (POSIX separators), skipping the ignored folder names.
export const listFiles = (dir: string, ignored: readonly string[] = DEFAULT_IGNORED): string[] => {
  const walk = (current: string): string[] =>
    readdirSync(current, { withFileTypes: true }).flatMap((entry) => {
      if (ignored.includes(entry.name)) {
        return [];
      }
      const full = path.join(current, entry.name);

      return entry.isDirectory() ? walk(full) : [path.relative(dir, full).split(path.sep).join('/')];
    });

  return walk(dir).sort();
};

export type GoldenResult = {
  readonly actual: string;
  readonly expected: string;
};

// Compares text with a golden file; E2E_UPDATE_GOLDEN=1 (or a missing golden file) writes the actual text instead.
export const matchGolden = (goldenPath: string, actual: string): GoldenResult => {
  const update = process.env['E2E_UPDATE_GOLDEN'] === '1' || !existsSync(goldenPath);
  if (update) {
    mkdirSync(path.dirname(goldenPath), { recursive: true });
    writeFileSync(goldenPath, actual);
  }

  return { actual, expected: readFileSync(goldenPath, 'utf8') };
};
