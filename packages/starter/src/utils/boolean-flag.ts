import { getArgv } from './argv.js';

export type BooleanFlag = 'install' | 'offline' | 'tests' | 'yarn';

const TRUE_WORDS: readonly string[] = ['true', 'yes', '1'];
const FALSE_WORDS: readonly string[] = ['false', 'no', '0'];

export const BOOLEAN_WORDS: readonly string[] = [...TRUE_WORDS, ...FALSE_WORDS];

// yargs gives a bare flag as true, --no-<flag> as false, --flag=1 as a number and other values as strings.
export const toBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === 'boolean') {
    return value;
  }
  const word = typeof value === 'string' || typeof value === 'number' ? String(value).toLowerCase() : '';
  if (TRUE_WORDS.includes(word)) {
    return true;
  }
  if (FALSE_WORDS.includes(word)) {
    return false;
  }

  return undefined;
};

// The flag as a boolean; undefined when it is not set or its value is no boolean.
export const readBooleanFlag = (flag: BooleanFlag): boolean | undefined => {
  const value: unknown = getArgv()[flag];

  return value === undefined ? undefined : toBoolean(value);
};
