import type { Mode } from '../types.js';

export const makeDevtool = (mode: Mode): string => (mode === 'development' ? 'eval-source-map' : 'hidden-source-map');
