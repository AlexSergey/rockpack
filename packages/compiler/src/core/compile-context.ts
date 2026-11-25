import type { Reporter } from '../reporter/reporter.js';

// What one compiler invocation needs to know about the build it belongs to.
export type CompileContext = {
  // Return the webpack config instead of running webpack (isomorphicCompiler runs both configs itself).
  readonly configOnly: boolean;
  // Part of an isomorphicCompiler build.
  readonly isomorphic: boolean;
  // Development live reload of an isomorphic build.
  readonly liveReload?: { readonly port: number; readonly server: LiveReloadServer };
  // The build output; shared by both compilers of an isomorphic build.
  readonly reporter?: Reporter;
};

export type LiveReloadServer = {
  refresh(path: string): void;
};

export const standaloneContext = (configOnly: boolean, reporter?: Reporter): CompileContext => ({
  configOnly,
  isomorphic: false,
  ...(reporter ? { reporter } : {}),
});
