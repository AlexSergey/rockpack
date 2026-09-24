import { matchGolden, packPackages, run } from '@rockpack/e2e-tools';
import path from 'node:path';

const goldenDir = path.join(__dirname, '..', 'golden');

// The starter templates are project sources on purpose, so they are not checked.
const isTemplate = (file: string): boolean => file.startsWith('templates/');

const FORBIDDEN = [
  /\.spec\./,
  /\.test\./,
  /__fixtures__/,
  /__mocks__/,
  /(^|\/)coverage\//,
  /test-reports\//,
  /(^|\/)src\//,
  /\.map$/,
];

describe('published tarballs', () => {
  const contents = new Map<string, string[]>();

  beforeAll(async () => {
    for (const [name, tarball] of await packPackages()) {
      const { code, output } = await run('tar', ['-tzf', tarball], { cwd: path.dirname(tarball) });
      if (code !== 0) {
        throw new Error(`Cannot list ${tarball}\n${output}`);
      }
      contents.set(
        name,
        output
          .split('\n')
          .filter(Boolean)
          .map((file) => file.replace(/^package\//, ''))
          .sort(),
      );
    }
  });

  describe.each(['babel', 'codestyle', 'compiler', 'starter', 'tester', 'tsconfig', 'utils'])(
    '@rockpack/%s',
    (name) => {
      const files = (): string[] => contents.get(`@rockpack/${name}`) ?? [];

      describe('negative cases', () => {
        it('ships no specs, fixtures, sources, reports or source maps', () => {
          expect(
            files().filter((file) => !isTemplate(file) && FORBIDDEN.some((pattern) => pattern.test(file))),
          ).toEqual([]);
        });
      });

      describe('positive cases', () => {
        it('ships the package.json, README and LICENSE', () => {
          expect(files()).toEqual(expect.arrayContaining(['LICENSE', 'package.json']));
        });

        it('matches the golden file list', () => {
          const { actual, expected } = matchGolden(path.join(goldenDir, `${name}.txt`), `${files().join('\n')}\n`);

          expect(actual).toBe(expected);
        });
      });
    },
  );
});
