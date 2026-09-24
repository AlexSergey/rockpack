import { listFiles, matchGolden } from '@rockpack/e2e-tools';
import { appendFileSync } from 'node:fs';
import path from 'node:path';

import { cleanupProjects, latest, npm, prepareProjects } from './projects.js';

type Outdated = Record<string, { current?: string; latest: string; wanted: string }>;

const TYPES = ['csr', 'ssr', 'component', 'library'] as const;
const goldenDir = path.join(__dirname, '..', 'golden');

const matrix = TYPES.flatMap((type) =>
  [true, false].map((tests) => ({ name: `${type}-${tests ? 'with' : 'without'}-tests`, tests, type })),
);

const BUILD_OUTPUT: Record<(typeof TYPES)[number], string> = {
  component: 'dist',
  csr: 'dist',
  library: 'lib',
  ssr: 'dist',
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
  let missing: ReadonlyMap<string, readonly string[]> = new Map();
  let outDir: string | undefined;

  beforeAll(async () => {
    ({ missing, outDir } = await prepareProjects('quality', matrix));
  }, 3_600_000);

  afterAll(() => {
    cleanupProjects(outDir);
  });

  describe.each(matrix)('$name', ({ name, tests, type }) => {
    const project = (): string => path.join(outDir ?? '', name);

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
