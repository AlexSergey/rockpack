import { statSync } from 'node:fs';
import { dirname } from 'node:path';

export const getRootRequireDir = (): string => {
  const main = process.argv[1] ?? process.cwd();
  const stat = statSync(main);

  return stat.isFile() ? dirname(main) : main;
};
