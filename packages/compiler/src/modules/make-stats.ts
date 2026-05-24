import type { CompilerConf } from '../types.js';

export const makeStats = (conf: Partial<CompilerConf>): 'errors-only' | { errorDetails: boolean } =>
  conf.debug ? { errorDetails: true } : 'errors-only';
