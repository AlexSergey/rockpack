import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type { PackageJson } from '../types.js';

import { compilerRoot } from '../utils/package-root.js';

export const makeBanner = (packageJson: PackageJson): false | string => {
  const bannerPath = path.join(compilerRoot(), 'banner');
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
        banner = banner.replace(`$\{${type}}`, packageJson[type]);
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
