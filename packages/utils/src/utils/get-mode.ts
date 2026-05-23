import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).parseSync();

export const getMode = (
  modes: readonly string[] = ['development', 'production'],
  defaultMode = 'development',
): string => {
  let mode = defaultMode;
  if (typeof argv['mode'] === 'string') {
    mode = argv['mode'];
  } else if (typeof process.env.NODE_ENV === 'string') {
    mode = process.env.NODE_ENV;
  }
  mode = modes.includes(mode) ? mode : defaultMode;

  return mode;
};
