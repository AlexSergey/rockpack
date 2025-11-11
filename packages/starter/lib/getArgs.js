import { argv } from '../utils/argv.js';

export const getArgs = () => {
  const args = {};

  if (typeof argv.install !== 'undefined') {
    args.noInstall = true;
  }

  if (argv.tests === 'true' || argv.tests === 'false') {
    args.tests = argv.tests === 'true';
  }

  if (typeof argv.type === 'string' && ['csr', 'ssr', 'component', 'library'].indexOf(argv.type) >= 0) {
    args.appType = argv.type;
  }

  if (typeof argv.folder === 'string') {
    args.folder = argv.folder;
  }

  return args;
};
