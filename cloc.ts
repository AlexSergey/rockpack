import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

type Count = {
  blank: number;
  files: number;
  lines: number;
};

const excludeFolders = new Set([
  'node_modules',
  '.git',
  '.idea',
  'NO_COMMIT',
  'prototypes',
  'build',
  'dist',
  'lib',
  'types',
  'public',
  'markup',
  '.cache',
  '.out',
  'migrations',
  'fixtures',
  'seeders',
  'coverage',
  'seo_report',
  '.storybook',
  'test-reports',
  'docs',
]);

const includeExt = new Set(['.cjs', '.css', '.js', '.jsx', '.less', '.md', '.mjs', '.scss', '.ts', '.tsx', '.yml']);

// Counts lines per extension without a system `cloc` binary; blank lines are listed apart from code and comments.
const walk = (dir: string, counts: Map<string, Count>): void => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!excludeFolders.has(entry.name)) {
        walk(fullPath, counts);
      }
      continue;
    }
    const ext = path.extname(entry.name);
    if (!entry.isFile() || !includeExt.has(ext)) {
      continue;
    }
    const lines = readFileSync(fullPath, 'utf8').split('\n');
    const blank = lines.filter((line) => line.trim() === '').length;
    const count = counts.get(ext) ?? { blank: 0, files: 0, lines: 0 };
    counts.set(ext, { blank: count.blank + blank, files: count.files + 1, lines: count.lines + lines.length - blank });
  }
};

const counts = new Map<string, Count>();
walk(process.cwd(), counts);

const rows = [...counts].sort(([, a], [, b]) => b.lines - a.lines);
const total = rows.reduce(
  (sum, [, count]) => ({
    blank: sum.blank + count.blank,
    files: sum.files + count.files,
    lines: sum.lines + count.lines,
  }),
  { blank: 0, files: 0, lines: 0 },
);

console.table(Object.fromEntries([...rows, ['total', total]]));
