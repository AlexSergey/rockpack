module.exports = {
  '*.md': ['prettier --write'],
  '*.{scss,css}': ['stylelint --fix'],
  '*.{ts,tsx,mts,json}': ['prettier --write', 'eslint --fix'],
  '*.{ts,tsx,mts}': [() => 'npm run lint:ts'],
};
