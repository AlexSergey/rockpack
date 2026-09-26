import type { BooleanFlag } from '../utils/boolean-flag.js';
import type { AppType } from './wizard.js';

import { getArgv } from '../utils/argv.js';
import { BOOLEAN_WORDS, readBooleanFlag, toBoolean } from '../utils/boolean-flag.js';

export const APP_TYPES: readonly AppType[] = ['csr', 'ssr', 'component', 'library'];

export type Args = {
  appType?: AppType;
  folder?: string;
  noInstall?: boolean;
  offline?: boolean;
  testMode: boolean;
  tests?: boolean;
  yes?: boolean;
};

const BOOLEAN_FLAGS: readonly BooleanFlag[] = ['tests', 'offline', 'install', 'yarn'];

const formatValue = (value: unknown): string => (typeof value === 'string' ? value : JSON.stringify(value));

// The problems with the flags that take a fixed set of values; the CLI prints them and exits with code 1.
export const validateArgs = (): string[] => {
  const argv = getArgv();
  const problems: string[] = [];
  const type: unknown = argv['type'];

  if (type !== undefined && !(APP_TYPES as unknown[]).includes(type)) {
    problems.push(`Unknown type "${formatValue(type)}". Use one of: ${APP_TYPES.join(', ')}`);
  }

  BOOLEAN_FLAGS.forEach((flag) => {
    const value: unknown = argv[flag];
    if (value !== undefined && toBoolean(value) === undefined) {
      problems.push(`Invalid value "${formatValue(value)}" for --${flag}. Use one of: ${BOOLEAN_WORDS.join(', ')}`);
    }
  });

  return problems;
};

export const getArgs = (): Args => {
  const argv = getArgv();
  const args: Args = {
    testMode: false,
  };

  if (readBooleanFlag('install') === false) {
    args.noInstall = true;
  }

  if (argv['mode'] === 'test') {
    args.testMode = true;
  }

  const tests = readBooleanFlag('tests');
  if (tests !== undefined) {
    args.tests = tests;
  }

  if (readBooleanFlag('offline') === true) {
    args.offline = true;
  }

  if (typeof argv['type'] === 'string' && (APP_TYPES as string[]).includes(argv['type'])) {
    args.appType = argv['type'] as AppType;
  }

  if (argv['yes'] === true || argv['y'] === true) {
    args.yes = true;
  }

  if (typeof argv['folder'] === 'string') {
    args.folder = argv['folder'];
  }

  return args;
};
