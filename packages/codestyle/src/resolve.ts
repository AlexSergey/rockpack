import { fileURLToPath } from 'node:url';

// Shared configs name their presets and plugins by absolute path, so a project resolves them from
// this package instead of relying on npm hoisting them next to it. import.meta.resolve, unlike
// require.resolve, also finds the presets that export only an `import` condition.
export const resolveFromCodestyle = (name: string): string => fileURLToPath(import.meta.resolve(name));
