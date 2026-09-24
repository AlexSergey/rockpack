import { listFiles, matchGolden, pinToLockfile, readLockedVersions, run, starterBin } from '@rockpack/e2e-tools';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const TYPES = ['csr', 'ssr', 'component', 'library'] as const;
const goldenDir = path.join(__dirname, '..', 'golden');
// Pinned mode: inside the monorepo, so @rockpack/* resolve to the workspace packages and the rest to the root lockfile.
const outDir = path.join(__dirname, '..', '.out', 'quality');

const matrix = TYPES.flatMap((type) =>
  [true, false].map((tests) => ({ name: `${type}-${tests ? 'with' : 'without'}-tests`, tests, type })),
);

const BUILD_OUTPUT: Record<(typeof TYPES)[number], string> = {
  component: 'dist',
  csr: 'dist',
  library: 'lib',
  ssr: 'dist',
};

const npm = (cwd: string, args: string[], timeout = 300_000): ReturnType<typeof run> =>
  run('npm', args, { cwd, timeout });

describe('generated project quality (pinned)', () => {
  const missing = new Map<string, string[]>();

  beforeAll(async () => {
    rmSync(outDir, { force: true, recursive: true });
    mkdirSync(outDir, { recursive: true });
    const locked = readLockedVersions(undefined, ['e2e/starter-e2e']);
    for (const { name, tests, type } of matrix) {
      const { code, output } = await run(
        process.execPath,
        [starterBin, name, `--type=${type}`, `--tests=${String(tests)}`, '--no-install', '--offline', '--mode=test'],
        { cwd: outDir },
      );
      if (code !== 0) {
        throw new Error(`Generating ${name} failed\n${output}`);
      }
      for (const file of ['package.json', 'example/package.json']) {
        const packageJsonPath = path.join(outDir, name, file);
        if (existsSync(packageJsonPath)) {
          const pinned = pinToLockfile(
            JSON.parse(readFileSync(packageJsonPath, 'utf8')) as Record<string, unknown>,
            locked,
          );
          writeFileSync(packageJsonPath, `${JSON.stringify(pinned.packageJson, null, 2)}\n`);
          missing.set(`${name}/${file}`, pinned.missing);
        }
      }
    }
  }, 120_000);

  describe.each(matrix)('$name', ({ name, tests, type }) => {
    const project = (): string => path.join(outDir, name);

    describe('negative cases', () => {
      it('uses only dependencies the monorepo lockfile provides', () => {
        expect(missing.get(`${name}/package.json`)).toEqual([]);
      });
    });

    describe('positive cases', () => {
      it('passes lint', async () => {
        const { code, output } = await npm(project(), ['run', 'lint']);

        expect({ code, output }).toMatchObject({ code: 0 });
      }, 300_000);

      if (tests) {
        it('passes its tests', async () => {
          const { code, output } = await npm(project(), ['test']);

          expect({ code, output }).toMatchObject({ code: 0 });
          expect(output).toContain('All tests have passed successfully!');
        }, 300_000);
      }

      it('builds the expected artifacts', async () => {
        const { code, output } = await npm(project(), ['run', 'build']);

        expect({ code, output }).toMatchObject({ code: 0 });
        const artifacts = listFiles(path.join(project(), BUILD_OUTPUT[type])).join('\n');
        const { actual, expected } = matchGolden(path.join(goldenDir, `${name}.build.txt`), `${artifacts}\n`);
        expect(actual).toBe(expected);
      }, 300_000);

      if (type === 'library' || type === 'component') {
        it('builds the example app', async () => {
          const { code, output } = await npm(project(), ['run', 'build:example']);

          expect({ code, output }).toMatchObject({ code: 0 });
        }, 300_000);

        it('publishes only the intended files', async () => {
          const { code, output } = await npm(project(), ['pack', '--dry-run', '--json']);

          expect(code).toBe(0);
          const [info] = JSON.parse(output.slice(output.indexOf('['))) as { files: { path: string }[] }[];
          const files = (info?.files ?? [])
            .map((file) => file.path)
            .sort()
            .join('\n');
          const { actual, expected } = matchGolden(path.join(goldenDir, `${name}.pack.txt`), `${files}\n`);
          expect(actual).toBe(expected);
        }, 300_000);
      }
    });
  });
});
