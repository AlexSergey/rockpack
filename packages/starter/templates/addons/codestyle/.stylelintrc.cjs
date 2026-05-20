module.exports = {
  extends: [
    'stylelint-config-tailwindcss',
    'stylelint-config-standard-scss',
    'stylelint-config-prettier-scss',
    'stylelint-config-clean-order',
  ],
  plugins: ['stylelint-scss'],
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
