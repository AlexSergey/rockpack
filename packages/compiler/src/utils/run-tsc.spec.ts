import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { runTsc } from './run-tsc.js';

// A stand-in for the tsc binary: prints its arguments and working folder, then exits with the given code.
const FAKE_TSC = `
const [code] = process.argv.slice(2);
process.stdout.write('args ' + process.argv.slice(2).join(' ') + '\\n');
process.stderr.write('cwd ' + process.cwd() + '\\n');
setTimeout(() => process.exit(Number(code)), code === 'wait' ? 60000 : 0);
`;

describe('runTsc', () => {
  let dir: string;
  let tsc: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'rockpack-run-tsc-'));
    tsc = path.join(dir, 'tsc.cjs');
    writeFileSync(tsc, FAKE_TSC);
  });

  afterEach(() => {
    rmSync(dir, { force: true, recursive: true });
  });

  describe('negative cases', () => {
    it('resolves with the exit code of a failed check instead of rejecting', async () => {
      await expect(runTsc(tsc, ['2'], dir)).resolves.toMatchObject({ code: 2 });
    });

    it('rejects when the signal aborts tsc', async () => {
      const controller = new AbortController();
      const run = runTsc(tsc, ['wait'], dir, controller.signal);
      controller.abort();

      await expect(run).rejects.toMatchObject({ name: 'AbortError' });
    });
  });

  describe('positive cases', () => {
    it('runs tsc with Node.js in the given folder and collects stdout and stderr', async () => {
      const { code, output } = await runTsc(tsc, ['0', '--noEmit'], dir);

      expect(code).toBe(0);
      expect(output).toContain('args 0 --noEmit');
      expect(output).toMatch(/cwd .*rockpack-run-tsc-/);
    });
  });
});
