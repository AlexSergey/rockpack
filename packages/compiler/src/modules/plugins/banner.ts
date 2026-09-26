import { isString } from '@rockpack/utils';

import type { PluginContext, PluginEntries } from './types.js';

import { makeBanner } from '../make-banner.js';

// Resolves conf.banner (string, true, false or undefined) against the package banner.
export const makeBannerPlugins = ({ conf, packageJson, wp }: PluginContext): PluginEntries => {
  let banner: false | string = makeBanner(packageJson);

  if (conf.banner) {
    if (isString(conf.banner)) {
      banner = conf.banner;
    }
  } else if (conf.banner === false) {
    banner = false;
  }

  return banner ? { BannerPlugin: new wp.BannerPlugin({ banner, entryOnly: true }) } : {};
};
