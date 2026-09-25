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

// The deprecated isomorphicCompiler(frontendCompiler(...), backendCompiler(...)) form starts the child compilers
// before isomorphicCompiler runs. isomorphicCompiler sets this promise synchronously, before its first await; the
// children await it after their first await, so they always get the shared context however long its setup takes.
// Removed together with that form in 10.0.
let legacyIsomorphicContext: Promise<CompileContext> | undefined;

export const getLegacyIsomorphicContext = (): Promise<CompileContext> | undefined => legacyIsomorphicContext;

export const setLegacyIsomorphicContext = (context: Promise<CompileContext> | undefined): void => {
  legacyIsomorphicContext = context;
};
