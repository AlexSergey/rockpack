type LiveReloadServer = {
  refresh(path: string): void;
};

declare global {
  // eslint-disable-next-line no-var
  var ISOMORPHIC: boolean | undefined;
  // eslint-disable-next-line no-var
  var CONFIG_ONLY: boolean | undefined;
  // eslint-disable-next-line no-var
  var LIVE_RELOAD_PORT: number | undefined;
  // eslint-disable-next-line no-var
  var LIVE_RELOAD_SERVER: LiveReloadServer | undefined;
}

export {};
