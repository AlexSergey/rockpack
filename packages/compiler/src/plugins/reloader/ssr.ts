const SERVER_POLL_INTERVAL = 200;
const SERVER_POLL_ATTEMPTS = 150;

const waitForServer = async (url: string): Promise<void> => {
  for (let attempt = 0; attempt < SERVER_POLL_ATTEMPTS; attempt++) {
    try {
      await fetch(url, { cache: 'no-store', method: 'HEAD' });

      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, SERVER_POLL_INTERVAL));
    }
  }
};

// livereload.js registers every window.LiveReloadPlugin* class. The compiler sends an empty path when the server
// restarts; reloading right away would hit the server before it listens and leave the browser on its error page.
export class RockpackSsrReload {
  static readonly identifier = 'rockpack-ssr';
  static readonly version = '1.0';

  private readonly window: Pick<Window, 'location'>;

  constructor(win: Pick<Window, 'location'>) {
    this.window = win;
  }

  reload(path: string): boolean {
    if (path !== '') {
      return false;
    }
    void waitForServer(this.window.location.href).then(() => {
      this.window.location.reload();
    });

    return true;
  }
}

if (typeof window !== 'undefined' && !document.getElementById('rockpack-livereload')) {
  (window as unknown as Record<string, unknown>)['LiveReloadPluginRockpackSsr'] = RockpackSsrReload;

  const script = document.createElement('script');
  script.id = 'rockpack-livereload';
  script.type = 'text/javascript';
  script.src = `http://localhost:${process.env['LIVE_RELOAD_PORT']}/livereload.js`;

  document.getElementsByTagName('head')[0]?.appendChild(script);
}
