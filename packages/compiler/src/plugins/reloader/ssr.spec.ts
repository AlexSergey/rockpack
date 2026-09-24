/**
 * @jest-environment jsdom
 */

const loadReloader = (): void => {
  jest.isolateModules(() => {
    jest.requireActual('./ssr.js');
  });
};

const getScripts = (): HTMLScriptElement[] => Array.from(document.querySelectorAll('#rockpack-livereload'));

describe('ssr live reload client', () => {
  const originalPort = process.env['LIVE_RELOAD_PORT'];

  beforeEach(() => {
    document.head.innerHTML = '';
    process.env['LIVE_RELOAD_PORT'] = '35729';
  });

  afterEach(() => {
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
  });

  describe('positive cases', () => {
    it('appends the livereload script to the head', () => {
      loadReloader();

      expect(getScripts()[0]?.outerHTML).toBe(
        '<script id="rockpack-livereload" type="text/javascript" src="http://localhost:35729/livereload.js"></script>',
      );
      expect(getScripts()[0]?.parentElement).toBe(document.head);
    });
  });
});
