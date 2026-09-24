import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Parsed on every call, so importing @rockpack/utils has no side effects; only --mode is read.
const readModeArgument = (): unknown => yargs(hideBin(process.argv)).help(false).version(false).parseSync()['mode'];

export const getMode = (
  modes: readonly string[] = ['development', 'production'],
  defaultMode = 'development',
): string => {
  const modeArgument = readModeArgument();
  let mode = defaultMode;
  if (typeof modeArgument === 'string') {
    mode = modeArgument;
  } else if (typeof process.env.NODE_ENV === 'string') {
    mode = process.env.NODE_ENV;
  }

  return modes.includes(mode) ? mode : defaultMode;
};
