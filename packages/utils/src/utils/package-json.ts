import { readFileSync } from 'node:fs';
import path from 'node:path';

export type PackageJson = {
  [key: string]: unknown;
  author?: string;
  dependencies?: Readonly<Record<string, string>>;
  description?: string;
  devDependencies?: Readonly<Record<string, string>>;
  engines?: Readonly<Record<string, string>>;
  license?: string;
  name?: string;
  peerDependencies?: Readonly<Record<string, string>>;
  version?: string;
};

// A missing or malformed package.json reads as undefined.
export const readPackageJson = (dir: string): PackageJson | undefined => {
  try {
    return JSON.parse(readFileSync(path.resolve(dir, 'package.json'), 'utf8')) as PackageJson;
  } catch {
    return undefined;
  }
};
