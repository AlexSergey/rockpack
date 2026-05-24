declare module 'deep-extend' {
  function deepExtend<T extends object>(target: T, ...sources: readonly object[]): T;
  export = deepExtend;
}

declare module 'find-package-json' {
  type PackageJSON = {
    name?: string;
    version?: string;
    author?: string;
    filename?: string;
    done?: boolean;
    [key: string]: unknown;
  };
  type Iterator = {
    next(): PackageJSON;
  };
  function finder(path?: string): Iterator;
  export = finder;
}

declare module 'livereload' {
  type LiveReloadServer = {
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
  class FriendlyErrorsWebpackPlugin {
    constructor(opts?: Record<string, unknown>);
  }
  export = FriendlyErrorsWebpackPlugin;
}

declare module 'case-sensitive-paths-webpack-plugin' {
  class CaseSensitivePathsPlugin {
    constructor(opts?: Record<string, unknown>);
  }
  export = CaseSensitivePathsPlugin;
}

declare module 'webpack-node-externals' {
  function nodeExternals(opts?: Record<string, unknown>): unknown;
  export = nodeExternals;
}

declare module 'webpack-bundle-analyzer' {
  class BundleAnalyzerPlugin {
    constructor(opts?: Record<string, unknown>);
  }
  export { BundleAnalyzerPlugin };
}

declare module '@statoscope/webpack-plugin' {
  class StatoscopeWebpackPlugin {
    constructor(opts?: Record<string, unknown>);
  }
  export default StatoscopeWebpackPlugin;
}

declare module 'webpack/lib/FlagDependencyUsagePlugin.js' {
  class FlagDependencyUsagePlugin {
    constructor(explanation?: boolean);
  }
  export = FlagDependencyUsagePlugin;
}

declare module 'webpack/lib/optimize/FlagIncludedChunksPlugin.js' {
  class FlagIncludedChunksPlugin {
    constructor();
  }
  export = FlagIncludedChunksPlugin;
}

declare module 'webpack-format-messages' {
  import type { Stats } from 'webpack';
  type Messages = { errors: string[]; warnings: string[] };
  function formatMessages(stats: Stats): Messages;
  export = formatMessages;
}
