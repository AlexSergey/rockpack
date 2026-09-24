import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { PackageJson } from '../types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The nearest package.json is the compiler root both for src/modules and lib/<format>/modules.
const findPackageRoot = (from: string): string => {
  let dir = from;
  while (!existsSync(path.join(dir, 'package.json'))) {
    const parent = path.dirname(dir);
    if (parent === dir) {
      return from;
    }
    dir = parent;
  }

  return dir;
};

export const makeBanner = (packageJson: PackageJson): false | string => {
  const bannerPath = path.join(findPackageRoot(__dirname), 'banner');
  let banner = existsSync(bannerPath) ? readFileSync(bannerPath, 'utf8') : '';

  if (banner) {
    const types: ('author' | 'description' | 'email' | 'license' | 'name' | 'version')[] = [
      'name',
      'version',
      'author',
      'email',
      'description',
      'license',
    ];

    for (const type of types) {
      if (banner.includes(`$\{${type}}`) && !!packageJson[type]) {
        banner = banner.replace(`$\{${type}}`, String(packageJson[type]));
      }
    }
    for (const type of types) {
      banner = banner.replace(`$\{${type}}`, '');
    }

    banner = banner
      .split('\n')
      .filter((i) => i !== '')
      .filter((item) => item !== '\r' && item !== '\n')
      .join('\n');

    return banner;
  }

  return false;
};
