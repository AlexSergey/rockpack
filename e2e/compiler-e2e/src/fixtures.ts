import type { RunResult, StartedProcess } from '@rockpack/e2e-tools';

import { run, start } from '@rockpack/e2e-tools';
import { JSDOM } from 'jsdom';
import { cpSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';

type Mode = 'development' | 'production';

const fixturesDir = path.join(__dirname, '..', 'fixtures');
// Inside the monorepo, so the fixtures resolve @rockpack/compiler and their dependencies from the workspaces.
const outDir = path.join(__dirname, '..', '.out');

// Copies a fixture into a clean folder and returns its path.
export const prepareFixture = (name: string): string => {
  const dir = path.join(outDir, name);
  rmSync(dir, { force: true, recursive: true });
  cpSync(path.join(fixturesDir, name), dir, { recursive: true });

  return dir;
};

// Runs one of the fixture's build scripts in a child process, as `npm run build` of a real project does.
export const build = (dir: string, script = 'scripts.build.ts', mode: Mode = 'production'): Promise<RunResult> =>
  run('npx', ['tsx', script], { cwd: dir, env: { NODE_ENV: mode }, timeout: 300_000 });

// Prepares a fixture and builds it, failing the suite with the build output when the build fails.
export const buildFixture = async (
  name: string,
  script?: string,
  { allowFailure = false }: { readonly allowFailure?: boolean } = {},
): Promise<{ dir: string; output: string }> => {
  const dir = prepareFixture(name);
  const { code, output } = await build(dir, script);
  if (code !== 0 && !allowFailure) {
    throw new Error(`Building ${name} failed\n${output}`);
  }

  return { dir, output };
};

// Starts a fixture's build script in development mode; --_rockpack_testing keeps the dev server from opening a browser.
export const startDev = (dir: string, script = 'scripts.build.ts', env: NodeJS.ProcessEnv = {}): StartedProcess =>
  start('npx', ['tsx', script, '--_rockpack_testing'], { cwd: dir, env: { ...env, NODE_ENV: 'development' } });

export const node = (dir: string, args: readonly string[]): Promise<RunResult> =>
  run(process.execPath, args, { cwd: dir });

export const read = (dir: string, file: string): string => readFileSync(path.join(dir, file), 'utf8');

// Loads the html and evaluates the given scripts in it, the way a browser runs the build.
export const loadPage = (html: string, scripts: readonly string[]): JSDOM => {
  const dom = new JSDOM(html, { pretendToBeVisual: true, runScripts: 'outside-only' });
  for (const script of scripts) {
    dom.window.eval(script);
  }

  return dom;
};

export const waitFor = async <T>(check: () => T | undefined, timeout = 5_000): Promise<T> => {
  const started = Date.now();
  for (;;) {
    const value = check();
    if (value !== undefined) {
      return value;
    }
    if (Date.now() - started > timeout) {
      throw new Error(`Condition not met in ${timeout} ms`);
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};
