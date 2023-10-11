module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier-scss', 'stylelint-config-clean-order'],
  plugins: ['stylelint-scss'],
  rules: {
    'color-named': 'never',
    'color-hex-length': 'short',
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
