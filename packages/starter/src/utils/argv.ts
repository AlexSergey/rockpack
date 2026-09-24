import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

// yargs' built-in --help and --version would answer before the Rockpack usage and version output.
export const argv = yargs(hideBin(process.argv)).help(false).version(false).parseSync();
