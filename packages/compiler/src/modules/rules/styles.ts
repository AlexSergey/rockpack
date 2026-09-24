import type { RuleContext, Rules } from './types.js';

import { getStylesRules } from '../../utils/get-styles-rules.js';

export const makeStyleRules = ({ conf, mode, root }: RuleContext): Rules => {
  const { css, less, scss } = getStylesRules(conf, mode, root);

  return {
    css: {
      exclude: /\.module\.css$/,
      test: /\.css$/,
      use: css.simple,
    },
    cssModules: {
      test: /\.module\.css$/,
      use: css.module,
    },
    less: {
      exclude: /\.module\.less$/,
      test: /\.less$/,
      use: less.simple,
    },
    lessModules: {
      test: /\.module\.less$/,
      use: less.module,
    },
    scss: {
      exclude: /\.module\.scss$/,
      test: /\.scss$/,
      use: scss.simple,
    },
    scssModules: {
      test: /\.module\.scss$/,
      use: scss.module,
    },
  };
};
