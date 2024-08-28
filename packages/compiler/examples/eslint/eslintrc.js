module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    mocha: true,
    node: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    indent: [2, 4], //4 spaces indent
    'jsx-quotes': [2, 'prefer-double'], //JSX double quotes
    quotes: [2, 'single'], //single quote in JS code,
    'react/jsx-uses-react': 2, //no-unused exclude error for import React
    'react-hooks/exhaustive-deps': 'warn',
    // Rules of hook - https://reactjs.org/docs/hooks-rules.html
    'react-hooks/rules-of-hooks': 'error',
  },
};
