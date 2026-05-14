module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier-scss', 'stylelint-config-clean-order'],
  plugins: ['stylelint-scss'],
  rules: {
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
  },
};
