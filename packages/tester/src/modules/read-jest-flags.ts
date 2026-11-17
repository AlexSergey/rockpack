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

export const isWholeNumber = (value: string | undefined): boolean => value !== undefined && /^\d+$/.test(value);

// `--testNamePattern=x` and `--bail=3` carry their value after the equals sign.
const valueAfterEquals = (arg: string, flag: string): string | undefined =>
  arg.startsWith(`${flag}=`) ? arg.slice(flag.length + 1) : undefined;

// Filled while reading the arguments, then returned as read-only JestFlags.
type MutableJestFlags = { -readonly [K in keyof JestFlags]: JestFlags[K] };

export const readJestFlags = (args: readonly string[]): JestFlags => {
  const flags: MutableJestFlags = {};

  args.forEach((arg, index) => {
    const next = args[index + 1];
    const namePattern = valueAfterEquals(arg, '--testNamePattern');
    const bailCount = valueAfterEquals(arg, '--bail');

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
      flags.bail = isWholeNumber(next) ? Number(next) : true;
    } else if (isWholeNumber(bailCount)) {
      flags.bail = Number(bailCount);
    }
  });

  return flags;
};
