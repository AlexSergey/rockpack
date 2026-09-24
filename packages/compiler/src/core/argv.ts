import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export type Argv = {
  $0: string;
  [key: string]: unknown;
  _: (number | string)[];
};

let parsed: Argv | undefined;

// The command-line arguments, parsed on first use rather than at import time.
export const getArgv = (): Argv => (parsed ??= yargs(hideBin(process.argv)).parseSync());

// Forgets the parsed arguments so the next getArgv() reads process.argv again (tests).
export const resetArgv = (): void => {
  parsed = undefined;
};
