// Reads `--mode=<value>` or `--mode <value>` (arguments after `--` are ignored).
const readModeArgument = (args: readonly string[]): string | undefined => {
  for (const [index, arg] of args.entries()) {
    if (arg === '--') {
      return undefined;
    }
    if (arg.startsWith('--mode=')) {
      return arg.slice('--mode='.length);
    }
    if (arg === '--mode') {
      const value = args[index + 1];

      return value !== undefined && !value.startsWith('-') ? value : undefined;
    }
  }

  return undefined;
};

export const getMode = (
  modes: readonly string[] = ['development', 'production'],
  defaultMode = 'development',
): string => {
  const mode = readModeArgument(process.argv.slice(2)) ?? process.env.NODE_ENV ?? defaultMode;

  return modes.includes(mode) ? mode : defaultMode;
};
