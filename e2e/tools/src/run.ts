import { spawn } from 'node:child_process';

export type RunOptions = {
  readonly cwd: string;
  readonly env?: NodeJS.ProcessEnv;
  readonly timeout?: number;
};

export type RunResult = {
  readonly code: null | number;
  readonly output: string;
};

// eslint-disable-next-line no-control-regex
const ANSI_PATTERN = /\x1B\[[0-9;?]*[A-Z]/gi;

export const stripAnsi = (text: string): string => text.replace(ANSI_PATTERN, '');

// Runs a command to completion and returns its exit code with stdout and stderr merged and stripped of ANSI codes.
export const run = (
  command: string,
  args: readonly string[],
  { cwd, env, timeout = 120_000 }: RunOptions,
): Promise<RunResult> =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    const onData = (chunk: Buffer): void => {
      output += chunk.toString();
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error(`${command} ${args.join(' ')} timed out after ${timeout} ms\n${stripAnsi(output)}`));
    }, timeout);
    child.on('error', reject);
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, output: stripAnsi(output) });
    });
  });

export type StartedProcess = {
  readonly output: () => string;
  readonly stop: () => Promise<void>;
  readonly waitForOutput: (pattern: RegExp, timeout?: number) => Promise<RegExpMatchArray>;
};

// Starts a long-running command in its own process group, so stop() also ends the children it spawns (webpack, nodemon).
export const start = (command: string, args: readonly string[], { cwd, env }: RunOptions): StartedProcess => {
  const child = spawn(command, args, {
    cwd,
    detached: true,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  const listeners = new Set<() => void>();
  const onData = (chunk: Buffer): void => {
    output += chunk.toString();
    listeners.forEach((listener) => listener());
  };
  child.stdout.on('data', onData);
  child.stderr.on('data', onData);
  const exited = new Promise<void>((resolve) => {
    child.on('close', () => resolve());
  });

  const waitForOutput = (pattern: RegExp, timeout = 60_000): Promise<RegExpMatchArray> =>
    new Promise((resolve, reject) => {
      const check = (): boolean => {
        const match = stripAnsi(output).match(pattern);
        if (match) {
          listeners.delete(onChange);
          clearTimeout(timer);
          resolve(match);
        }

        return Boolean(match);
      };
      const onChange = (): void => void check();
      const timer = setTimeout(() => {
        listeners.delete(onChange);
        reject(new Error(`Timed out waiting for ${String(pattern)}\n${stripAnsi(output)}`));
      }, timeout);
      if (!check()) {
        listeners.add(onChange);
      }
    });

  const stop = async (): Promise<void> => {
    if (child.pid !== undefined && child.exitCode === null) {
      try {
        process.kill(-child.pid, 'SIGTERM');
      } catch {
        // The group is already gone.
      }
      await exited;
    }
  };

  return { output: () => stripAnsi(output), stop, waitForOutput };
};
