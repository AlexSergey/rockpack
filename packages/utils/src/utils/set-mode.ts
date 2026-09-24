import type { ModeSources } from './get-mode.js';

import { getMode } from './get-mode.js';

// Resolves the mode like getMode and writes it to NODE_ENV and BABEL_ENV of the given (or the process) environment.
export const setMode = <M extends string>(modes: readonly M[], defaultMode: M, sources: ModeSources = {}): M => {
  const env = sources.env ?? process.env;
  const mode = getMode(modes, defaultMode, { ...sources, env });
  env['NODE_ENV'] = mode;
  env['BABEL_ENV'] = mode;

  return mode;
};
