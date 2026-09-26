// Flags whose next argument is their value (`--mode test`), not a spec path pattern: `--mode` is read by setMode, the
// others are Jest flags that take a value.
const FLAGS_WITH_VALUE: readonly string[] = ['--mode', '--testNamePattern', '-t', '--config', '-c'];

// The positional command line arguments (like `jest <pattern>`); flags and the values of FLAGS_WITH_VALUE are skipped.
export const readTestPathPatterns = (args: readonly string[]): string[] =>
  args.filter((arg, index) => !arg.startsWith('-') && !FLAGS_WITH_VALUE.includes(args[index - 1] ?? ''));
