import { packPackages, pinToLockfile, readLockedVersions, run, starterBin, useTarballs } from '@rockpack/e2e-tools';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export type PreparedProjects = {
  // Dependencies a pinned project declares but the monorepo lockfile does not provide, per package.json.
  readonly missing: ReadonlyMap<string, readonly string[]>;
  readonly outDir: string;
};

export type ProjectSpec = {
  readonly name: string;
  readonly tests: boolean;
  readonly type: string;
};

// Pinned: generated inside the monorepo, so @rockpack/* resolve to the workspace packages and the rest to the root
// lockfile. Latest: generated in a temp directory and installed for real, @rockpack/* from the local tarballs.
export const latest = process.env['E2E_MODE'] === 'latest';

export const npm = (cwd: string, args: readonly string[], timeout = 300_000): ReturnType<typeof run> =>
  run('npm', args, { cwd, timeout });

const readJson = <T>(file: string): T => JSON.parse(readFileSync(file, 'utf8')) as T;

const writeJson = (file: string, value: unknown): void => {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};

const generate = async (outDir: string, { name, tests, type }: ProjectSpec): Promise<void> => {
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

const pin = (dir: string, locked: ReadonlyMap<string, string>, missing: Map<string, readonly string[]>): void => {
  for (const file of ['package.json', 'example/package.json']) {
    const packageJsonPath = path.join(dir, file);
    if (existsSync(packageJsonPath)) {
      const pinned = pinToLockfile(readJson<Record<string, unknown>>(packageJsonPath), locked);
      writeJson(packageJsonPath, pinned.packageJson);
      missing.set(`${path.basename(dir)}/${file}`, pinned.missing);
    }
  }
};

const install = async (dir: string, tarballs: ReadonlyMap<string, string>): Promise<void> => {
  const packageJsonPath = path.join(dir, 'package.json');
  const packageJson = readJson<Record<string, unknown>>(packageJsonPath);
  // The @rockpack packages depend on each other: the transitive ones come from the tarballs too.
  const overrides = Object.fromEntries([...tarballs].map(([dep, tarball]) => [dep, `file:${tarball}`]));
  // Keys keep the standard package.json order, which the generated project's lint checks.
  const entries = Object.entries(packageJson).flatMap(([key, value]): [string, unknown][] => {
    const isDeps = key === 'dependencies' || key === 'devDependencies';
    const rewritten: [string, unknown] = [key, isDeps ? useTarballs(value as Record<string, string>, tarballs) : value];
    const isFirstDeps = isDeps && !(key === 'devDependencies' && 'dependencies' in packageJson);

    return isFirstDeps ? [['overrides', overrides], rewritten] : [rewritten];
  });
  writeJson(packageJsonPath, Object.fromEntries(entries));
  const { code, output } = await npm(dir, ['install', '--no-audit', '--no-fund'], 600_000);
  if (code !== 0) {
    throw new Error(`Installing ${path.basename(dir)} failed\n${output}`);
  }
};

// Generates the projects for the current mode: pinned under e2e/starter-e2e/.out/<suite>, latest in a temp directory.
export const prepareProjects = async (suite: string, specs: readonly ProjectSpec[]): Promise<PreparedProjects> => {
  const missing = new Map<string, readonly string[]>();
  if (latest) {
    const outDir = mkdtempSync(path.join(os.tmpdir(), `rockpack-${suite}-`));
    const tarballs = await packPackages();
    for (const spec of specs) {
      await generate(outDir, spec);
      await install(path.join(outDir, spec.name), tarballs);
    }

    return { missing, outDir };
  }
  const outDir = path.join(__dirname, '..', '.out', suite);
  rmSync(outDir, { force: true, recursive: true });
  mkdirSync(outDir, { recursive: true });
  const locked = readLockedVersions(undefined, ['e2e/starter-e2e']);
  for (const spec of specs) {
    await generate(outDir, spec);
    pin(path.join(outDir, spec.name), locked, missing);
  }

  return { missing, outDir };
};

// Latest-mode projects live in a temp directory and are removed unless E2E_KEEP=1; pinned ones stay for inspection.
export const cleanupProjects = (outDir: string | undefined): void => {
  if (outDir && latest && process.env['E2E_KEEP'] !== '1') {
    rmSync(outDir, { force: true, recursive: true });
  }
};
