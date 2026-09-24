import { getArgv, resetArgv } from './argv.js';

// yargs is ESM-only; this stand-in parses `--flag`, `--key=value` and positionals, enough for the memo behaviour.
jest.mock('yargs', () =>
  jest.fn((args: string[]) => ({
    parseSync: (): Record<string, unknown> => {
      const parsed: Record<string, unknown> = { _: args.filter((arg) => !arg.startsWith('--')) };
      for (const arg of args.filter((flag) => flag.startsWith('--'))) {
        const [key = '', value] = arg.slice(2).split('=');
        parsed[key] = value ?? true;
      }

      return parsed;
    },
  })),
);
jest.mock('yargs/helpers', () => ({ hideBin: (argv: string[]): string[] => argv.slice(2) }));

const originalArgv = process.argv;

describe('getArgv', () => {
  afterEach(() => {
    process.argv = originalArgv;
    resetArgv();
  });

  describe('negative cases', () => {
    it('keeps the first parse until it is reset', () => {
      process.argv = ['node', 'scripts.build.ts', '--analyzer'];
      const first = getArgv();
      process.argv = ['node', 'scripts.build.ts'];

      expect(getArgv()).toBe(first);
      expect(getArgv()['analyzer']).toBe(true);
    });
  });

  describe('positive cases', () => {
    it('parses the process arguments on first use', () => {
      process.argv = ['node', 'scripts.build.ts', '--mode=production', 'extra'];

      expect(getArgv()).toMatchObject({ _: ['extra'], mode: 'production' });
    });

    it('reads process.argv again after a reset', () => {
      process.argv = ['node', 'scripts.build.ts', '--analyzer'];
      getArgv();
      resetArgv();
      process.argv = ['node', 'scripts.build.ts'];

      expect(getArgv()['analyzer']).toBeUndefined();
    });
  });
});
