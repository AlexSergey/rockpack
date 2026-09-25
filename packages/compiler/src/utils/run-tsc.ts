import { spawn } from 'node:child_process';

export type TscResult = {
  readonly code: null | number;
  readonly output: string;
};

// Runs a tsc binary with Node.js in `cwd`; resolves with its exit code and output (type errors are output, not
// failures) and rejects when tsc cannot start or the signal aborts it.
export const runTsc = (tsc: string, args: readonly string[], cwd: string, signal?: AbortSignal): Promise<TscResult> =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [tsc, ...args], {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      ...(signal ? { signal } : {}),
    });
    let output = '';
    const collect = (chunk: Buffer): void => {
      output += chunk.toString();
    };
    child.stdout.on('data', collect);
    child.stderr.on('data', collect);
    child.on('error', reject);
    child.on('close', (code) => {
      resolve({ code, output });
    });
  });
