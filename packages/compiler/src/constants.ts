export const defaultDistFile = 'index';
export const distExtension = '.js';
// Specs, test helpers and fixtures never reach the build output or the declarations.
export const testFilesIgnore = [
  '**/*.spec.{ts,tsx,js,jsx}',
  '**/*.test.{ts,tsx,js,jsx}',
  '**/__fixtures__/**',
  '**/__mocks__/**',
  '**/__tests__/**',
];
export const moduleFormats = {
  cjs: 'cjs',
  esm: 'esm',
} as const;
