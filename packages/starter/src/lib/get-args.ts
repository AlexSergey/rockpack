import type { AppType } from './wizard.js';

import { argv } from '../utils/argv.js';

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

export const getArgs = (): Args => {
  const args: Args = {
    testMode: false,
  };

  if (String(argv['install']) === 'false') {
    args.noInstall = true;
  }

  if (argv['mode'] === 'test') {
    args.testMode = true;
  }

  if (argv['tests'] === 'true' || argv['tests'] === 'false') {
    args.tests = argv['tests'] === 'true';
  }

  if (argv['offline'] === true) {
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
