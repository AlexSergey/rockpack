interface LiveReloadServer {
  refresh(path: string): void;
}

declare global {
  var ISOMORPHIC: boolean | undefined;

  var CONFIG_ONLY: boolean | undefined;

  var LIVE_RELOAD_PORT: number | undefined;

  var LIVE_RELOAD_SERVER: LiveReloadServer | undefined;
}

export {};
