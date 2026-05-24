import type { Mode } from '../types.js';

export const makeDevtool = (mode: Mode): string => {
  switch (mode) {
    case 'development':
      return 'eval-source-map';
    case 'production':
      return 'hidden-source-map';
    default:
      return 'inline-source-map';
  }
};
