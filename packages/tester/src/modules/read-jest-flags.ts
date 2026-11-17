// Jest flags the tester forwards from the command line; any other flag is ignored.
export type JestFlags = {
  // Stop after the first failing test suite (true) or after this many.
  readonly bail?: boolean | number;
  // Run as on a CI server: snapshots that do not exist yet fail instead of being written.
  readonly ci?: boolean;
  // Run only the tests whose name matches this pattern (`-t`).
  readonly testNamePattern?: string;
  // Re-record the snapshots that fail (`-u`).
  readonly updateSnapshot?: boolean;
};

export const isNumber = (value: string | undefined): value is string => value !== undefined && /^\d+$/.test(value);

// `--testNamePattern=x` and `--bail=3` carry their value after the equals sign.
const valueAfterEquals = (arg: string, flag: string): string | undefined =>
  arg.startsWith(`${flag}=`) ? arg.slice(flag.length + 1) : undefined;

export const readJestFlags = (args: readonly string[]): JestFlags => {
  const flags: { -readonly [K in keyof JestFlags]: JestFlags[K] } = {};

  args.forEach((arg, index) => {
    const next = args[index + 1];
    const namePattern = valueAfterEquals(arg, '--testNamePattern');

    if ((arg === '-t' || arg === '--testNamePattern') && next !== undefined) {
      flags.testNamePattern = next;
    } else if (namePattern !== undefined) {
      flags.testNamePattern = namePattern;
    } else if (arg === '-u' || arg === '--updateSnapshot') {
      flags.updateSnapshot = true;
    } else if (arg === '--ci') {
      flags.ci = true;
    } else if (arg === '--bail') {
      // The number is optional: `--bail cli` stops at the first failure and keeps `cli` as a path pattern.
      flags.bail = isNumber(next) ? Number(next) : true;
    } else if (isNumber(valueAfterEquals(arg, '--bail'))) {
      flags.bail = Number(valueAfterEquals(arg, '--bail'));
    }
  });

  return flags;
};
