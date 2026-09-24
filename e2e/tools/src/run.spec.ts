import { tmpdir } from 'node:os';

import { run, start, stripAnsi } from './run.js';

const node = process.execPath;

describe('run', () => {
  describe('negative cases', () => {
    it('returns a non-zero exit code with the output', async () => {
      const result = await run(node, ['-e', 'console.error("broken"); process.exit(3)'], { cwd: tmpdir() });

      expect(result).toEqual({ code: 3, output: 'broken\n' });
    });

    it('rejects when the command outlives the timeout', async () => {
      await expect(run(node, ['-e', 'setTimeout(() => {}, 10000)'], { cwd: tmpdir(), timeout: 200 })).rejects.toThrow(
        'timed out after 200 ms',
      );
    });

    it('rejects waiting for output that never comes', async () => {
      const child = start(node, ['-e', 'setTimeout(() => {}, 10000)'], { cwd: tmpdir() });

      await expect(child.waitForOutput(/never/, 200)).rejects.toThrow('Timed out waiting for /never/');
      await child.stop();
    });
  });

  describe('positive cases', () => {
    it('strips ANSI colors', () => {
      expect(stripAnsi('\u001B[32mgreen\u001B[39m')).toBe('green');
    });

    it('passes the environment and merges stdout and stderr', async () => {
      const result = await run(node, ['-e', 'console.log(process.env.E2E_VALUE); console.error("err")'], {
        cwd: tmpdir(),
        env: { E2E_VALUE: 'value' },
      });

      expect(result.code).toBe(0);
      expect(result.output).toContain('value');
      expect(result.output).toContain('err');
    });

    it('waits for output and stops the whole process group', async () => {
      const script = `
        const { spawn } = require('node:child_process');
        const child = spawn(process.execPath, ['-e', 'setTimeout(() => {}, 10000)'], { stdio: 'ignore' });
        console.log('child ' + child.pid);
        setTimeout(() => {}, 10000);
      `;
      const parent = start(node, ['-e', script], { cwd: tmpdir() });
      const [, childPid] = await parent.waitForOutput(/child (\d+)/);

      await parent.stop();
      await new Promise((resolve) => setTimeout(resolve, 200));

      expect(() => process.kill(Number(childPid), 0)).toThrow();
    });
  });
});
