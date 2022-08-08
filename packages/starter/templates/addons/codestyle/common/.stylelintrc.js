module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier-scss'],
  plugins: ['stylelint-scss'],
  rules: {
    indentation: 2,
    'color-named': 'never',
    'color-hex-length': 'short',
    'declaration-block-trailing-semicolon': 'always',
    'max-empty-lines': 1,
    'function-parentheses-space-inside': 'never',
    'function-url-quotes': 'always',
    'property-case': 'lower',
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'media-query-list-comma-space-after': 'always',
    /*'block-closing-brace-empty-line-before': null,
    'block-opening-brace-space-before': 'always',

    'value-list-comma-newline-after': 'never-multi-line',
    'value-list-comma-newline-before': 'never-multi-line',
    'value-list-comma-space-after': 'always',*/
  },
};
