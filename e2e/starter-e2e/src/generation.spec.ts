import { listFiles, matchGolden, run, starterBin } from '@rockpack/e2e-tools';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const TYPES = ['csr', 'ssr', 'component', 'library'] as const;
const goldenDir = path.join(__dirname, '..', 'golden');

type PackageJson = Record<string, unknown> & {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
};

// @rockpack/* follow the monorepo version; the golden files keep a placeholder so a release does not rewrite them.
const normalise = (packageJson: PackageJson): string =>
  `${JSON.stringify(packageJson, null, 2).replace(/("@rockpack\/[a-z-]+": )"[^"]+"/g, '$1"<rockpack>"')}\n`;

const matrix = TYPES.flatMap((type) =>
  [true, false].map((tests) => ({ name: `${type}-${tests ? 'with' : 'without'}-tests`, tests, type })),
);

// Generated outside the monorepo (as a user would), so git init and the git files are part of the result.
describe('starter generation', () => {
  let root: string;

  beforeAll(async () => {
    root = mkdtempSync(path.join(tmpdir(), 'rockpack-generation-'));
    for (const { name, tests, type } of matrix) {
      const { code, output } = await run(
        process.execPath,
        [starterBin, name, `--type=${type}`, `--tests=${String(tests)}`, '--no-install', '--offline', '--mode=test'],
        { cwd: root },
      );
      if (code !== 0) {
        throw new Error(`Generating ${name} failed\n${output}`);
      }
    }
  }, 120_000);

  afterAll(() => {
    rmSync(root, { force: true, recursive: true });
  });

  describe.each(matrix)('$name', ({ name, tests, type }) => {
    const project = (): string => path.join(root, name);
    const packageJson = (): PackageJson =>
      JSON.parse(readFileSync(path.join(project(), 'package.json'), 'utf8')) as PackageJson;

    describe('negative cases', () => {
      it(tests ? 'has the tester setup' : 'has no tester setup', () => {
        expect(existsSync(path.join(project(), 'scripts.tests.ts'))).toBe(tests);
        expect(Object.keys(packageJson().devDependencies ?? {}).includes('@rockpack/tester')).toBe(tests);
      });

      it(type === 'library' || type === 'component' ? 'has an example app' : 'has no example app', () => {
        const hasExample = type === 'library' || type === 'component';

        expect(existsSync(path.join(project(), 'example', 'package.json'))).toBe(hasExample);
        expect(existsSync(path.join(project(), '.npmignore'))).toBe(hasExample);
      });
    });

    describe('positive cases', () => {
      it('matches the golden file tree', () => {
        const { actual, expected } = matchGolden(
          path.join(goldenDir, `${name}.files.txt`),
          `${listFiles(project()).join('\n')}\n`,
        );

        expect(actual).toBe(expected);
      });

      it('matches the golden package.json', () => {
        const { actual, expected } = matchGolden(
          path.join(goldenDir, `${name}.package.json`),
          normalise(packageJson()),
        );

        expect(actual).toBe(expected);
      });

      it('initialises git and declares the git hooks', () => {
        expect(existsSync(path.join(project(), '.git'))).toBe(true);
        expect(existsSync(path.join(project(), '.gitignore'))).toBe(true);
        expect(existsSync(path.join(project(), '.gitattributes'))).toBe(true);
        expect(packageJson()['simple-git-hooks']).toMatchObject({
          'commit-msg': 'npm run lint:commit',
          'pre-commit': 'npm run pre-commit',
        });
        expect(packageJson().scripts?.['prepare']).toBe('simple-git-hooks');
      });

      it('ships CLAUDE.md and the .env of the template', () => {
        expect(existsSync(path.join(project(), 'CLAUDE.md'))).toBe(true);
        expect(existsSync(path.join(project(), '.env'))).toBe(existsSync(path.join(project(), '.env.example')));
      });
    });
  });
});
