import { createRequire } from 'node:module';

export const _require = createRequire(import.meta.url);

export const getPreset = (
  presetName: string,
  options: Record<string, unknown> = {},
): [string, Record<string, unknown>] => [_require.resolve(presetName), options];
