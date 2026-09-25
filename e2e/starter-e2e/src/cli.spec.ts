import { repoRoot, run, starterBin } from '@rockpack/e2e-tools';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const { version } = JSON.parse(readFileSync(path.join(repoRoot, 'packages/starter/package.json'), 'utf8')) as {
  version: string;
};

const GENERATE = ['--type=csr', '--tests=false', '--no-install', '--offline'];

const rockpack = (cwd: string, args: string[], env: NodeJS.ProcessEnv = {}): ReturnType<typeof run> =>
  run(process.execPath, [starterBin, ...args], { cwd, env });

const readName = (dir: string): string =>
  (JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8')) as { name: string }).name;

describe('starter CLI', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'rockpack-cli-'));
  });

  afterEach(() => {
    rmSync(dir, { force: true, recursive: true });
  });

  describe('negative cases', () => {
    it('exits with code 1 without a project name', async () => {
      const { code, output } = await rockpack(dir, []);

      expect(code).toBe(1);
      expect(output).toContain('Please specify the project directory');
    });

    it('exits with code 1 and lists the types for an unknown --type', async () => {
      const { code, output } = await rockpack(dir, ['app', '--type=desktop']);

      expect(code).toBe(1);
      expect(output).toContain('Unknown type "desktop". Use one of: csr, ssr, component, library');
    });

    it('exits with code 1 when the project directory is not empty', async () => {
      mkdirSync(path.join(dir, 'app'));
      writeFileSync(path.join(dir, 'app', 'notes.txt'), '');

      const { code, output } = await rockpack(dir, ['app', ...GENERATE]);

      expect(code).toBe(1);
      expect(output).toContain('Project "app" has already created');
    });

    it('prints the Node.js requirement on an older Node.js', async () => {
      const preload = path.join(dir, 'old-node.cjs');
      writeFileSync(preload, "Object.defineProperty(process.versions, 'node', { value: '23.11.0' });\n");

      const { code, output } = await rockpack(dir, ['-v'], { NODE_OPTIONS: `--require=${preload}` });

      expect(code).toBe(1);
      expect(output).toContain('Rockpack requires Node 24 or higher');
    });
  });

  describe('positive cases', () => {
    it.each(['-v', '--version'])('prints the version for %s', async (flag) => {
      const { code, output } = await rockpack(dir, [flag]);

      expect(code).toBe(0);
      expect(output.trim()).toBe(`Rockpack v${version}`);
    });

    it.each(['-h', '--help'])('prints the usage for %s', async (flag) => {
      const { code, output } = await rockpack(dir, [flag]);

      expect(code).toBe(0);
      expect(output).toContain('USAGE');
      expect(output).toContain('rockpack proj');
    });

    it('creates the project inside --folder', async () => {
      const { code } = await rockpack(dir, ['app', '--folder=projects', ...GENERATE]);

      expect(code).toBe(0);
      expect(readName(path.join(dir, 'projects', 'app'))).toBe('app');
    });

    it('names a project created with "." in a folder without git after the folder', async () => {
      const folder = path.join(dir, 'plain folder');
      mkdirSync(folder);

      const { code } = await rockpack(folder, ['.', ...GENERATE]);

      expect(code).toBe(0);
      expect(readName(folder)).toBe('plain_folder');
    });

    it('names a project created with "." in a git repository after the folder', async () => {
      const repo = path.join(dir, 'my project');
      mkdirSync(path.join(repo, '.git'), { recursive: true });

      const { code } = await rockpack(repo, ['.', ...GENERATE]);

      expect(code).toBe(0);
      expect(readName(repo)).toBe('my_project');
    });
  });
});
