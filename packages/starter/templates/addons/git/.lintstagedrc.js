module.exports = {
  'package.json': ['npm run format:package'],
  'src/**/*.{ts,tsx}': [() => 'npm run lint:ts'],
  'src/**/*.{ts,tsx,json}': ['prettier --write', 'eslint --fix'],
  'src/**/*.{scss,css}': ['stylelint --fix'],
  '*.md': ['prettier --write']
}
