import { listFiles, matchGolden, repoRoot, run } from '@rockpack/e2e-tools';
import { existsSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';

import { loadPage, read } from './fixtures';

const examplesDir = path.join(repoRoot, 'examples/compiler');
const goldenDir = path.join(__dirname, '..', 'golden');
const OUTPUT_DIRS = ['dist', 'lib', 'public'];
// Examples that need an external binary run only when it is installed.
const REQUIRED_BINARIES: Readonly<Record<string, string>> = { 'advanced-config-elm-support': 'elm' };

const hasBinary = (binary: string): boolean => existsSync(path.join(repoRoot, 'node_modules/.bin', binary));

const examples = readdirSync(examplesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => {
    const binary = REQUIRED_BINARIES[name];

    return !binary || hasBinary(binary);
  })
  .sort();

describe('compiler examples', () => {
  describe.each(examples)('%s', (name) => {
    const dir = path.join(examplesDir, name);
    let built: { code: null | number; output: string };

    beforeAll(async () => {
      for (const output of OUTPUT_DIRS) {
        rmSync(path.join(dir, output), { force: true, recursive: true });
      }
      built = await run('npm', ['run', 'build'], { cwd: dir, timeout: 300_000 });
    }, 300_000);

    describe('negative cases', () => {
      it('runs its page without script errors', () => {
        if (!existsSync(path.join(dir, 'dist/index.html'))) {
          return;
        }
        const html = read(dir, 'dist/index.html');
        const scripts = [...html.matchAll(/<script[^>]*src="\/?(?:\.\/)?([^"]+)"/g)].map(([, src = '']) => src);
        const errors: string[] = [];
        const dom = loadPage(html, []);
        dom.window.alert = (): void => undefined;
        for (const script of scripts) {
          try {
            dom.window.eval(read(dir, path.join('dist', script)));
          } catch (error) {
            errors.push(`${script}: ${String(error)}`);
          }
        }

        expect(errors).toEqual([]);
        dom.window.close();
      });
    });

    describe('positive cases', () => {
      it('builds the expected artifacts', () => {
        expect({ code: built.code, output: built.output }).toMatchObject({ code: 0 });
        const artifacts = OUTPUT_DIRS.filter((output) => existsSync(path.join(dir, output))).flatMap((output) =>
          listFiles(path.join(dir, output)).map((file) => `${output}/${file}`),
        );
        const { actual, expected } = matchGolden(path.join(goldenDir, `${name}.txt`), `${artifacts.join('\n')}\n`);

        expect(actual).toBe(expected);
      });
    });
  });
});
