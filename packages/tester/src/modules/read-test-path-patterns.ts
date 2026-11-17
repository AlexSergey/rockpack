import { isNumber } from './read-jest-flags.js';

// Flags whose next argument is their value (`--mode test`), not a spec path pattern: `--mode` is read by setMode, the
// others are Jest flags that take a value.
const FLAGS_WITH_VALUE: readonly string[] = ['--mode', '--testNamePattern', '-t', '--config', '-c'];

// Flags whose value is an optional number (`--bail 3`): a number after them is their value, anything else is not.
const FLAGS_WITH_OPTIONAL_NUMBER: readonly string[] = ['--bail'];

const isFlagValue = (arg: string, previous: string): boolean =>
  FLAGS_WITH_VALUE.includes(previous) || (FLAGS_WITH_OPTIONAL_NUMBER.includes(previous) && isNumber(arg));

// The positional command line arguments (like `jest <pattern>`); flags and the values of flags are skipped.
export const readTestPathPatterns = (args: readonly string[]): string[] =>
  args.filter((arg, index) => !arg.startsWith('-') && !isFlagValue(arg, args[index - 1] ?? ''));
