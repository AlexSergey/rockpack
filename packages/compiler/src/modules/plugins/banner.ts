import { isBoolean, isString } from 'valid-types';

import type { PluginContext, PluginEntries } from './types.js';

import { makeBanner } from '../make-banner.js';

// Resolves conf.banner (string, true, false or undefined) against the package banner and stores the result.
export const makeBannerPlugins = ({ conf, packageJson, wp }: PluginContext): PluginEntries => {
  let banner: false | string = makeBanner(packageJson);

  if (conf.banner) {
    if (isString(conf.banner)) {
      banner = conf.banner;
    }
  } else if (isBoolean(conf.banner) && conf.banner === false) {
    banner = false;
  }

  conf.banner = banner;

  return banner ? { BannerPlugin: new wp.BannerPlugin({ banner, entryOnly: true }) } : {};
};
