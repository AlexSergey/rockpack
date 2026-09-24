import { getMode } from './get-mode.js';

export const setMode = (modes: readonly string[], defaultMode: string): string => {
  const mode = getMode(modes, defaultMode);
  process.env['NODE_ENV'] = mode;
  process.env['BABEL_ENV'] = mode;

  return mode;
};
