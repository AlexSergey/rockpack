declare module 'eslint-plugin-no-only-tests' {
  import type { ESLint } from 'eslint';
  const plugin: ESLint.Plugin;
  export = plugin;
}

declare module '@rockpack/utils' {
  export const getMode: (modes?: readonly string[], defaultMode?: string) => string;
}
