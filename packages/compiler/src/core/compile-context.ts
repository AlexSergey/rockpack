// What one compiler invocation needs to know about the build it belongs to.
export type CompileContext = {
  // Return the webpack config instead of running webpack (isomorphicCompiler runs both configs itself).
  readonly configOnly: boolean;
  // Part of an isomorphicCompiler build.
  readonly isomorphic: boolean;
  // Development live reload of an isomorphic build.
  readonly liveReload?: { readonly port: number; readonly server: LiveReloadServer };
};

export type LiveReloadServer = {
  refresh(path: string): void;
};

export const standaloneContext = (configOnly: boolean): CompileContext => ({ configOnly, isomorphic: false });

// The deprecated isomorphicCompiler(frontendCompiler(...), backendCompiler(...)) form starts the child compilers
// before isomorphicCompiler runs; they read this context after their first await, when isomorphicCompiler has set it.
// Removed together with that form in 10.0.
let legacyIsomorphicContext: CompileContext | undefined;

export const getLegacyIsomorphicContext = (): CompileContext | undefined => legacyIsomorphicContext;

export const setLegacyIsomorphicContext = (context: CompileContext | undefined): void => {
  legacyIsomorphicContext = context;
};
