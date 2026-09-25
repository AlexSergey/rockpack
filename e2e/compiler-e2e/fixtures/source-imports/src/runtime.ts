import data from './data.json' with { type: 'json' };
import { fromFile } from './both';
import { fromIndex } from './utils';

export const result = async (): Promise<string> => {
  const { lazy } = await import('./lazy');

  return [data.name, fromFile, fromIndex, lazy].join(',');
};
