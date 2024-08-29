module.exports = {
  '*.md': ['prettier --write'],
  'package.json': ['npm run format:package'],
  'src/**/*.{scss,css}': ['stylelint --fix'],
  'src/**/*.{ts,tsx,json}': ['prettier --write', 'eslint --fix'],
  'src/**/*.{ts,tsx}': [() => 'npm run lint:ts'],
};
