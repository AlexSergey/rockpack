import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { PackageJson } from '../types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const makeBanner = (packageJson: PackageJson): false | string => {
  const bannerPath = path.resolve(__dirname, '../../../', './banner');
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
      if (banner.indexOf(type) > 0 && !!packageJson[type]) {
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
