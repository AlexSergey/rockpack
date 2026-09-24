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

export type DefaultMode = 'development' | 'production';

export type ModeSources = {
  // Command-line arguments without the node binary and the script path; defaults to `process.argv.slice(2)`.
  readonly argv?: readonly string[];
  // Defaults to `process.env`.
  readonly env?: NodeJS.ProcessEnv;
};

const DEFAULT_MODES: readonly DefaultMode[] = ['development', 'production'];

// The mode from `--mode`, then NODE_ENV, then the default; anything outside `modes` falls back to the default.
export function getMode(): DefaultMode;
export function getMode<M extends string>(modes: readonly M[], defaultMode: M, sources?: ModeSources): M;
export function getMode(
  modes: readonly string[] = DEFAULT_MODES,
  defaultMode = 'development',
  { argv = process.argv.slice(2), env = process.env }: ModeSources = {},
): string {
  const mode = readModeArgument(argv) ?? env['NODE_ENV'] ?? defaultMode;

  return modes.includes(mode) ? mode : defaultMode;
}
