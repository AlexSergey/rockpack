import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

type Argv = ReturnType<ReturnType<typeof yargs>['parseSync']>;

let parsed: Argv | undefined;

// The command-line arguments, parsed on first use rather than at import time. yargs' built-in --help and
// --version would answer before the Rockpack usage and version output.
export const getArgv = (): Argv => (parsed ??= yargs(hideBin(process.argv)).help(false).version(false).parseSync());
