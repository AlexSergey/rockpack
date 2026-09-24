import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isArray, isString } from 'valid-types';

import type { InternalCompilerConf, Mode } from '../types.js';

import { distExtension } from '../constants.js';
import { RockpackError } from '../errors/rockpack-error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ssrExt = import.meta.url.endsWith('.mjs') ? '.mjs' : '.cjs';

type EntryResult = {
  context: string;
  entry: Record<string, string | string[]>;
};

export const makeEntry = (conf: Partial<InternalCompilerConf>, root: string, mode: Mode): EntryResult => {
  if (!isString(conf.src)) {
    throw new RockpackError('INVALID_ENTRY', 'Src must be a string!');
  }

  const entry: Record<string, string | string[]> = {};
  const entryPoint = path.basename(conf.dist ?? 'dist/index.js').replace(distExtension, '');

  if (isArray(conf.vendor)) {
    entry['vendor'] = conf.vendor;
  }

  if (conf.__isIsomorphicFrontend && mode === 'development') {
    entry['dev-server'] = path.resolve(__dirname, `../plugins/reloader/ssr${ssrExt}`);
  }

  entry[entryPoint] = path.resolve(root, conf.src);
  const context = path.dirname(entry[entryPoint]);

  return { context, entry };
};
