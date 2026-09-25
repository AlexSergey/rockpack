import type { Config } from 'stylelint';

import { resolveFromCodestyle } from './resolve.js';

export const stylelintConfig: Config = {
  extends: [
    resolveFromCodestyle('stylelint-config-tailwindcss'),
    resolveFromCodestyle('stylelint-config-standard-scss'),
    resolveFromCodestyle('stylelint-config-prettier-scss'),
    resolveFromCodestyle('stylelint-config-clean-order'),
  ],
  plugins: [resolveFromCodestyle('stylelint-scss')],
  rules: {
    // Tailwind v4
    'at-rule-no-unknown': null,
    'color-hex-length': 'short',
    'color-named': 'never',
    'function-url-quotes': 'always',
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    // Tailwind v4
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['theme'],
      },
    ],
    // font-family ignore
    'value-keyword-case': [
      'lower',
      {
        ignoreKeywords: ['BlinkMacSystemFont'],
      },
    ],
  },
};
