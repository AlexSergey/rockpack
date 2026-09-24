import { makeConfig } from '@rockpack/codestyle';

const config = makeConfig();

config.push({
  rules: {
    'package-json/require-type': 'off',
  },
});

// Relative imports in package sources carry the runtime extension (.js), as NodeNext resolution requires.
const relativeImportWithoutExtension = '[source.value=/^[.](?!.*[.](js|json|cjs)$)/]';

config.push({
  files: ['src/**/*.ts'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        message: 'Add the .js extension to relative imports in package sources.',
        selector: [
          `ImportDeclaration${relativeImportWithoutExtension}`,
          `ExportNamedDeclaration${relativeImportWithoutExtension}`,
          `ExportAllDeclaration${relativeImportWithoutExtension}`,
        ].join(', '),
      },
    ],
  },
});

export default config;
