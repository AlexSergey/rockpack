import {
  listFiles,
  matchGolden,
  packPackages,
  pinToLockfile,
  readLockedVersions,
  run,
  starterBin,
  useTarballs,
} from '@rockpack/e2e-tools';
import { appendFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type Outdated = Record<string, { current?: string; latest: string; wanted: string }>;

const TYPES = ['csr', 'ssr', 'component', 'library'] as const;
const goldenDir = path.join(__dirname, '..', 'golden');
// Pinned: generated inside the monorepo, so @rockpack/* resolve to the workspace packages and the rest to the root
// lockfile. Latest: generated in a temp directory and installed for real, @rockpack/* from the local tarballs.
const latest = process.env['E2E_MODE'] === 'latest';

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

const readJson = <T>(file: string): T => JSON.parse(readFileSync(file, 'utf8')) as T;

const writeJson = (file: string, value: unknown): void => {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};

const major = (version: string): number => Number.parseInt(version, 10);

// The job summary lists the packages whose latest major is ahead of versions.json: the signal to bump it.
const reportMajorsAhead = (name: string, outdated: Outdated): void => {
  const rows = Object.entries(outdated)
    .filter(([, { latest: newest, wanted }]) => major(newest) > major(wanted))
    .map(([dep, { latest: newest, wanted }]) => `| ${name} | ${dep} | ${wanted} | ${newest} |`);
  if (rows.length === 0) {
    return;
  }
  const report = ['| Project | Package | Wanted | Latest |', '|---|---|---|---|', ...rows, ''].join('\n');
  const summary = process.env['GITHUB_STEP_SUMMARY'];
  if (summary) {
    appendFileSync(summary, `${report}\n`);
  } else {
    console.log(report);
  }
};

describe(`generated project quality (${latest ? 'latest' : 'pinned'})`, () => {
  const missing = new Map<string, string[]>();
  let outDir: string;

  const generate = async (name: string, type: string, tests: boolean): Promise<void> => {
    const offline = latest ? [] : ['--offline'];
    const { code, output } = await run(
      process.execPath,
      [starterBin, name, `--type=${type}`, `--tests=${String(tests)}`, '--no-install', ...offline, '--mode=test'],
      { cwd: outDir, timeout: 120_000 },
    );
    if (code !== 0) {
      throw new Error(`Generating ${name} failed\n${output}`);
    }
  };

  const pin = (name: string, locked: ReadonlyMap<string, string>): void => {
    for (const file of ['package.json', 'example/package.json']) {
      const packageJsonPath = path.join(outDir, name, file);
      if (existsSync(packageJsonPath)) {
        const pinned = pinToLockfile(readJson<Record<string, unknown>>(packageJsonPath), locked);
        writeJson(packageJsonPath, pinned.packageJson);
        missing.set(`${name}/${file}`, pinned.missing);
      }
    }
  };

  const install = async (name: string, tarballs: ReadonlyMap<string, string>): Promise<void> => {
    const packageJsonPath = path.join(outDir, name, 'package.json');
    const packageJson = readJson<Record<string, unknown>>(packageJsonPath);
    // The @rockpack packages depend on each other: the transitive ones come from the tarballs too.
    const overrides = Object.fromEntries([...tarballs].map(([dep, tarball]) => [dep, `file:${tarball}`]));
    // Keys keep the standard package.json order, which the generated project's lint checks.
    const entries = Object.entries(packageJson).flatMap(([key, value]): [string, unknown][] => {
      const isDeps = key === 'dependencies' || key === 'devDependencies';
      const rewritten: [string, unknown] = [
        key,
        isDeps ? useTarballs(value as Record<string, string>, tarballs) : value,
      ];
      const isFirstDeps = isDeps && !(key === 'devDependencies' && 'dependencies' in packageJson);

      return isFirstDeps ? [['overrides', overrides], rewritten] : [rewritten];
    });
    writeJson(packageJsonPath, Object.fromEntries(entries));
    const { code, output } = await npm(path.join(outDir, name), ['install', '--no-audit', '--no-fund'], 600_000);
    if (code !== 0) {
      throw new Error(`Installing ${name} failed\n${output}`);
    }
  };

  beforeAll(async () => {
    if (latest) {
      outDir = mkdtempSync(path.join(os.tmpdir(), 'rockpack-quality-'));
      const tarballs = await packPackages();
      for (const { name, tests, type } of matrix) {
        await generate(name, type, tests);
        await install(name, tarballs);
      }

      return;
    }
    outDir = path.join(__dirname, '..', '.out', 'quality');
    rmSync(outDir, { force: true, recursive: true });
    mkdirSync(outDir, { recursive: true });
    const locked = readLockedVersions(undefined, ['e2e/starter-e2e']);
    for (const { name, tests, type } of matrix) {
      await generate(name, type, tests);
      pin(name, locked);
    }
  }, 3_600_000);

  afterAll(() => {
    if (latest && process.env['E2E_KEEP'] !== '1') {
      rmSync(outDir, { force: true, recursive: true });
    }
  });

  describe.each(matrix)('$name', ({ name, tests, type }) => {
    const project = (): string => path.join(outDir, name);

    describe('negative cases', () => {
      if (latest) {
        it('has no dependency behind the wanted version', async () => {
          const { output } = await npm(project(), ['outdated', '--json']);
          const outdated = Object.fromEntries(
            Object.entries(JSON.parse(output.slice(output.indexOf('{'))) as Outdated).filter(
              ([dep]) => !dep.startsWith('@rockpack/'),
            ),
          );
          reportMajorsAhead(name, outdated);

          expect(Object.keys(outdated).filter((dep) => outdated[dep]?.current !== outdated[dep]?.wanted)).toEqual([]);
        }, 300_000);
      } else {
        it('uses only dependencies the monorepo lockfile provides', () => {
          expect(missing.get(`${name}/package.json`)).toEqual([]);
        });
      }
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
