import type { AppType } from './wizard';

import { argv } from '../utils/argv';

export interface Args {
  appType?: AppType;
  folder?: string;
  noInstall?: boolean;
  testMode: boolean;
  tests?: boolean;
}

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

  if (typeof argv['type'] === 'string' && (['csr', 'ssr', 'component', 'library'] as string[]).includes(argv['type'])) {
    args.appType = argv['type'] as AppType;
  }

  if (typeof argv['folder'] === 'string') {
    args.folder = argv['folder'];
  }

  return args;
};
