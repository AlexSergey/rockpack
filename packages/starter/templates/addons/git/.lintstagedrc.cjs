module.exports = {
  '*.md': ['prettier --write'],
  '*.{scss,css}': ['stylelint --fix'],
  '*.{ts,tsx,json}': ['prettier --write', 'eslint --fix'],
  '*.{ts,tsx}': [() => 'npm run lint:ts'],
};
