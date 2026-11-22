import { getArgv } from './argv.js';

export type BooleanFlag = 'install' | 'offline' | 'pnpm' | 'tests' | 'yarn';

const TRUE_WORDS: readonly string[] = ['true', 'yes', '1'];
const FALSE_WORDS: readonly string[] = ['false', 'no', '0'];

export const BOOLEAN_WORDS: readonly string[] = [...TRUE_WORDS, ...FALSE_WORDS];

export const BOOLEAN_FLAGS: readonly BooleanFlag[] = ['tests', 'offline', 'install', 'yarn', 'pnpm'];

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

// yargs takes the word after a bare flag as its value, so `--pnpm my-app` would swallow the project name.
// A bare boolean flag followed by anything but a boolean word is set to true instead.
export const attachBareBooleanFlags = (args: readonly string[]): string[] =>
  args.map((arg, index) => {
    const next = args[index + 1];
    const isBareBooleanFlag = (BOOLEAN_FLAGS as readonly string[]).some((flag) => arg === `--${flag}`);
    if (!isBareBooleanFlag || next === undefined || next.startsWith('-') || toBoolean(next) !== undefined) {
      return arg;
    }

    return `${arg}=true`;
  });
