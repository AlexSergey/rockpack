declare module 'deep-extend' {
  function deepExtend<T extends object>(target: T, ...sources: readonly object[]): T;
  export = deepExtend;
}

declare module 'find-package-json' {
  type Iterator = {
    next(): PackageJSON;
  };
  type PackageJSON = {
    [key: string]: unknown;
    author?: string;
    done?: boolean;
    filename?: string;
    name?: string;
    version?: string;
  };
  function finder(path?: string): Iterator;
  export = finder;
}

declare module 'livereload' {
  type LiveReloadServer = {
    close(): void;
    config: { port: number };
    refresh(path: string): void;
  };
  function createServer(opts?: Record<string, unknown>): LiveReloadServer;
  export { createServer };
}

declare module 'find-free-port' {
  function findFreePort(port: number, cb: (err: Error | null, port: number) => void): void;
  export = findFreePort;
}

declare module '@nuxt/friendly-errors-webpack-plugin' {
  import type { Compiler } from 'webpack';

  class FriendlyErrorsWebpackPlugin {
    constructor(opts?: Record<string, unknown>);
    apply(compiler: Compiler): void;
  }
  export = FriendlyErrorsWebpackPlugin;
}

declare module 'case-sensitive-paths-webpack-plugin' {
  import type { Compiler } from 'webpack';

  class CaseSensitivePathsPlugin {
    constructor(opts?: Record<string, unknown>);
    apply(compiler: Compiler): void;
  }
  export = CaseSensitivePathsPlugin;
}

declare module 'webpack-node-externals' {
  function nodeExternals(opts?: Record<string, unknown>): unknown;
  export = nodeExternals;
}

declare module 'webpack-bundle-analyzer' {
  import type { Compiler } from 'webpack';

  class BundleAnalyzerPlugin {
    constructor(opts?: Record<string, unknown>);
    apply(compiler: Compiler): void;
  }
  export { BundleAnalyzerPlugin };
}

declare module '@statoscope/webpack-plugin' {
  import type { Compiler } from 'webpack';

  class StatoscopeWebpackPlugin {
    constructor(opts?: Record<string, unknown>);
    apply(compiler: Compiler): void;
  }

  export default StatoscopeWebpackPlugin;
}

declare module 'webpack/lib/FlagDependencyUsagePlugin.js' {
  import type { Compiler } from 'webpack';

  class FlagDependencyUsagePlugin {
    constructor(explanation?: boolean);
    apply(compiler: Compiler): void;
  }
  export = FlagDependencyUsagePlugin;
}

declare module 'webpack/lib/optimize/FlagIncludedChunksPlugin.js' {
  import type { Compiler } from 'webpack';

  class FlagIncludedChunksPlugin {
    constructor();
    apply(compiler: Compiler): void;
  }
  export = FlagIncludedChunksPlugin;
}

declare module 'webpack-format-messages' {
  import type { Stats } from 'webpack';
  type Messages = {
    errors: string[];
    warnings: string[];
  };
  function formatMessages(stats: Stats): Messages;
  export = formatMessages;
}
