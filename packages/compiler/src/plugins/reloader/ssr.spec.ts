/**
 * @jest-environment jsdom
 */

import { RockpackSsrReload } from './ssr.js';

const loadReloader = (): void => {
  jest.isolateModules(() => {
    jest.requireActual('./ssr.js');
  });
};

const makeWindow = (): Pick<Window, 'location'> & { location: { reload: jest.Mock } } =>
  ({ location: { href: 'http://localhost:4000/page', reload: jest.fn() } }) as unknown as Pick<Window, 'location'> & {
    location: { reload: jest.Mock };
  };

const getScripts = (): HTMLScriptElement[] => Array.from(document.querySelectorAll('#rockpack-livereload'));

describe('ssr live reload client', () => {
  const originalPort = process.env['LIVE_RELOAD_PORT'];
  // jsdom has no fetch
  const fetchMock = jest.fn<Promise<unknown>, [string, RequestInit]>();

  beforeEach(() => {
    document.head.innerHTML = '';
    process.env['LIVE_RELOAD_PORT'] = '35729';
    delete (window as unknown as Record<string, unknown>)['LiveReloadPluginRockpackSsr'];
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.useRealTimers();
    delete (globalThis as { fetch?: typeof fetch }).fetch;
    if (originalPort === undefined) {
      delete process.env['LIVE_RELOAD_PORT'];
    } else {
      process.env['LIVE_RELOAD_PORT'] = originalPort;
    }
  });

  describe('negative cases', () => {
    it('does not add a second script', () => {
      loadReloader();
      loadReloader();

      expect(getScripts()).toHaveLength(1);
    });

    it('leaves the reload of a changed file to livereload', () => {
      const win = makeWindow();

      expect(new RockpackSsrReload(win).reload('styles.css')).toBe(false);
      expect(win.location.reload).not.toHaveBeenCalled();
    });

    it('does not reload the page while the restarted server refuses connections', async () => {
      jest.useFakeTimers();
      fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
      const win = makeWindow();

      new RockpackSsrReload(win).reload('');
      await jest.advanceTimersByTimeAsync(1000);

      expect(win.location.reload).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('appends the livereload script to the head', () => {
      loadReloader();

      expect(getScripts()[0]?.outerHTML).toBe(
        '<script id="rockpack-livereload" type="text/javascript" src="http://localhost:35729/livereload.js"></script>',
      );
      expect(getScripts()[0]?.parentElement).toBe(document.head);
    });

    it('registers the server restart plugin for livereload.js', () => {
      loadReloader();

      const plugin = (window as unknown as Record<string, undefined | { identifier?: string }>)[
        'LiveReloadPluginRockpackSsr'
      ];

      expect(plugin?.identifier).toBe('rockpack-ssr');
    });

    it('reloads the page once the restarted server answers', async () => {
      jest.useFakeTimers();
      fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValue({});
      const win = makeWindow();

      expect(new RockpackSsrReload(win).reload('')).toBe(true);
      await jest.advanceTimersByTimeAsync(200);

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:4000/page', { cache: 'no-store', method: 'HEAD' });
      expect(win.location.reload).toHaveBeenCalledTimes(1);
    });
  });
});
