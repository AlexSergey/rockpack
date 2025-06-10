import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

export const argv = yargs(hideBin(process.argv)).argv;
